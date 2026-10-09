CREATE TABLE `meta_base_lead_daily_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricDate` date NOT NULL,
	`sourceRows` int NOT NULL,
	`uniqueLeadIds` int NOT NULL,
	`sourceRunLabel` varchar(32) NOT NULL,
	`sourceTimeZone` varchar(64) NOT NULL,
	`refreshedAt` bigint NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `meta_base_lead_daily_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `meta_base_lead_daily_metrics_date_unique` UNIQUE(`metricDate`)
);
--> statement-breakpoint
CREATE INDEX `meta_base_lead_daily_metrics_refresh_idx` ON `meta_base_lead_daily_metrics` (`refreshedAt`);