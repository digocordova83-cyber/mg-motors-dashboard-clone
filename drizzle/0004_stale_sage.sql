CREATE TABLE `dashboard_source_refreshes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` enum('GOOGLE_ADS','META_ADS') NOT NULL,
	`refreshDate` date NOT NULL,
	`periodFrom` date NOT NULL,
	`periodTo` date NOT NULL,
	`lastAttemptStatus` enum('SUCCESS','FAILED') NOT NULL,
	`attemptCount` int NOT NULL DEFAULT 1,
	`lastAttemptAt` bigint NOT NULL,
	`lastSuccessAt` bigint,
	`lastSuccessSource` varchar(64),
	`lastSuccessMetadata` json NOT NULL,
	`lastError` text,
	`taskUid` varchar(65),
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `dashboard_source_refreshes_id` PRIMARY KEY(`id`),
	CONSTRAINT `dashboard_source_refreshes_source_date_unique` UNIQUE(`source`,`refreshDate`)
);
--> statement-breakpoint
CREATE INDEX `dashboard_source_refreshes_status_attempt_idx` ON `dashboard_source_refreshes` (`lastAttemptStatus`,`lastAttemptAt`);--> statement-breakpoint
CREATE INDEX `dashboard_source_refreshes_task_uid_idx` ON `dashboard_source_refreshes` (`taskUid`);