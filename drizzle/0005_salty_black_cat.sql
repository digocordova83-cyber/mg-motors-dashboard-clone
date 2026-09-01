CREATE TABLE `dashboard_data_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('GOOGLE_ADS','META_ADS') NOT NULL,
	`periodFrom` date NOT NULL,
	`periodTo` date NOT NULL,
	`dataThroughDate` date NOT NULL,
	`sourceName` varchar(64) NOT NULL,
	`payload` json NOT NULL,
	`refreshedAt` bigint NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `dashboard_data_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `dashboard_data_snapshots_source_period_unique` UNIQUE(`source`,`periodFrom`,`periodTo`)
);
--> statement-breakpoint
CREATE INDEX `dashboard_data_snapshots_period_idx` ON `dashboard_data_snapshots` (`source`,`periodTo`,`refreshedAt`);