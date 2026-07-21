ALTER TABLE `leads` ADD `contentHash` varchar(64) NULL;
--> statement-breakpoint
UPDATE `leads`
SET `contentHash` = SHA2(
  CONCAT_WS(
    CHAR(31),
    LOWER(TRIM(REGEXP_REPLACE(`sourceDateRaw`, '[[:space:]]+', ' '))),
    LOWER(TRIM(REGEXP_REPLACE(`model`, '[[:space:]]+', ' '))),
    LOWER(TRIM(REGEXP_REPLACE(`region`, '[[:space:]]+', ' '))),
    LOWER(TRIM(REGEXP_REPLACE(`city`, '[[:space:]]+', ' '))),
    LOWER(TRIM(REGEXP_REPLACE(`dealerName`, '[[:space:]]+', ' '))),
    LOWER(TRIM(REGEXP_REPLACE(`contactName`, '[[:space:]]+', ' '))),
    `email`,
    `phone`,
    LOWER(TRIM(REGEXP_REPLACE(`channel`, '[[:space:]]+', ' '))),
    DATE_FORMAT(`correctedDate`, '%Y-%m-%d')
  ),
  256
);
--> statement-breakpoint
DELETE newer
FROM `leads` AS newer
INNER JOIN `leads` AS older
  ON newer.`contentHash` = older.`contentHash`
 AND newer.`id` > older.`id`;
--> statement-breakpoint
UPDATE `lead_imports` AS imports
INNER JOIN (
  SELECT `importId`, COUNT(*) AS `rowsInsertedAfterDeduplication`
  FROM `leads`
  GROUP BY `importId`
) AS current_rows
  ON current_rows.`importId` = imports.`id`
SET
  imports.`rowsInserted` = current_rows.`rowsInsertedAfterDeduplication`,
  imports.`rowsSkipped` = GREATEST(
    0,
    imports.`rowsTotal` - imports.`rowsInvalid` - current_rows.`rowsInsertedAfterDeduplication`
  );
--> statement-breakpoint
ALTER TABLE `leads` MODIFY `contentHash` varchar(64) NOT NULL;
--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_content_hash_unique` UNIQUE(`contentHash`);
