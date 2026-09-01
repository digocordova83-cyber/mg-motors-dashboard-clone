ALTER TABLE `weekly_sales_imports` ADD `dealersWithoutReferenceSales` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `weekly_sales_imports` ADD `referenceDealerSalesTotal` int;--> statement-breakpoint
ALTER TABLE `weekly_sales_imports` ADD `referenceRegionSalesTotal` int;--> statement-breakpoint
ALTER TABLE `weekly_sales_imports` ADD `referenceReportedSalesTotal` int;--> statement-breakpoint
UPDATE `weekly_sales_imports`
SET
  `dealersWithoutReferenceSales` = `dealersWithoutWeek4Sales`,
  `referenceDealerSalesTotal` = `week4DealerSalesTotal`,
  `referenceRegionSalesTotal` = `week4RegionSalesTotal`,
  `referenceReportedSalesTotal` = `week4ReportedSalesTotal`
WHERE `referenceWeek` = 4;
--> statement-breakpoint
UPDATE `weekly_sales_imports` AS `imports`
INNER JOIN `weekly_sales_records` AS `total_record`
  ON `total_record`.`importId` = `imports`.`id`
  AND `total_record`.`rowType` = 'TOTAL'
SET `imports`.`referenceWeek` = CASE
  WHEN `total_record`.`week5Retail` IS NOT NULL THEN 5
  WHEN `total_record`.`week4Retail` IS NOT NULL THEN 4
  WHEN `total_record`.`week3Retail` IS NOT NULL THEN 3
  WHEN `total_record`.`week2Retail` IS NOT NULL THEN 2
  WHEN `total_record`.`week1Retail` IS NOT NULL THEN 1
  ELSE `imports`.`referenceWeek`
END;--> statement-breakpoint
UPDATE `weekly_sales_imports` AS `imports`
SET
  `imports`.`referenceReportedSalesTotal` = (
    SELECT CASE `imports`.`referenceWeek`
      WHEN 5 THEN `record`.`week5Retail`
      WHEN 4 THEN `record`.`week4Retail`
      WHEN 3 THEN `record`.`week3Retail`
      WHEN 2 THEN `record`.`week2Retail`
      ELSE `record`.`week1Retail`
    END
    FROM `weekly_sales_records` AS `record`
    WHERE `record`.`importId` = `imports`.`id` AND `record`.`rowType` = 'TOTAL'
    LIMIT 1
  ),
  `imports`.`referenceDealerSalesTotal` = (
    SELECT COALESCE(SUM(CASE `imports`.`referenceWeek`
      WHEN 5 THEN `record`.`week5Retail`
      WHEN 4 THEN `record`.`week4Retail`
      WHEN 3 THEN `record`.`week3Retail`
      WHEN 2 THEN `record`.`week2Retail`
      ELSE `record`.`week1Retail`
    END), 0)
    FROM `weekly_sales_records` AS `record`
    WHERE `record`.`importId` = `imports`.`id` AND `record`.`rowType` = 'DEALER'
  ),
  `imports`.`referenceRegionSalesTotal` = (
    SELECT COALESCE(SUM(CASE `imports`.`referenceWeek`
      WHEN 5 THEN `record`.`week5Retail`
      WHEN 4 THEN `record`.`week4Retail`
      WHEN 3 THEN `record`.`week3Retail`
      WHEN 2 THEN `record`.`week2Retail`
      ELSE `record`.`week1Retail`
    END), 0)
    FROM `weekly_sales_records` AS `record`
    WHERE `record`.`importId` = `imports`.`id` AND `record`.`rowType` = 'REGION'
  ),
  `imports`.`dealersWithoutReferenceSales` = (
    SELECT COUNT(*)
    FROM `weekly_sales_records` AS `record`
    WHERE
      `record`.`importId` = `imports`.`id`
      AND `record`.`rowType` = 'DEALER'
      AND CASE `imports`.`referenceWeek`
        WHEN 5 THEN `record`.`week5Retail`
        WHEN 4 THEN `record`.`week4Retail`
        WHEN 3 THEN `record`.`week3Retail`
        WHEN 2 THEN `record`.`week2Retail`
        ELSE `record`.`week1Retail`
      END IS NULL
  );
