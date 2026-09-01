CREATE TABLE `lead_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileHash` varchar(64) NOT NULL,
	`fileSizeBytes` int NOT NULL,
	`fileKey` varchar(512),
	`fileUrl` text,
	`status` enum('PROCESSING','COMPLETED','FAILED') NOT NULL DEFAULT 'PROCESSING',
	`rowsTotal` int NOT NULL DEFAULT 0,
	`rowsInserted` int NOT NULL DEFAULT 0,
	`rowsSkipped` int NOT NULL DEFAULT 0,
	`rowsInvalid` int NOT NULL DEFAULT 0,
	`errorSummary` json,
	`importedBy` varchar(120) NOT NULL,
	`createdAt` bigint NOT NULL,
	`completedAt` bigint,
	CONSTRAINT `lead_imports_id` PRIMARY KEY(`id`),
	CONSTRAINT `lead_imports_file_hash_unique` UNIQUE(`fileHash`)
);
--> statement-breakpoint
CREATE TABLE `lead_monthly_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competencia` varchar(7) NOT NULL,
	`goalCount` int NOT NULL,
	`createdBy` varchar(120) NOT NULL,
	`updatedBy` varchar(120) NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `lead_monthly_goals_id` PRIMARY KEY(`id`),
	CONSTRAINT `lead_monthly_goals_competencia_unique` UNIQUE(`competencia`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`importId` int NOT NULL,
	`sourceRowNumber` int NOT NULL,
	`recordHash` varchar(64) NOT NULL,
	`correctedDate` date NOT NULL,
	`correctedDateRaw` varchar(64) NOT NULL,
	`sourceDateRaw` text NOT NULL,
	`channel` varchar(120) NOT NULL,
	`channelRaw` varchar(255) NOT NULL,
	`model` varchar(120) NOT NULL,
	`modelRaw` varchar(255) NOT NULL,
	`region` varchar(32) NOT NULL,
	`regionRaw` varchar(255) NOT NULL,
	`city` varchar(160) NOT NULL,
	`cityRaw` varchar(255) NOT NULL,
	`dealerName` varchar(255) NOT NULL,
	`dealerRaw` varchar(255) NOT NULL,
	`contactName` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`rawPayload` json NOT NULL,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_record_hash_unique` UNIQUE(`recordHash`)
);
--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_importId_lead_imports_id_fk` FOREIGN KEY (`importId`) REFERENCES `lead_imports`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lead_imports_status_created_idx` ON `lead_imports` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `lead_monthly_goals_updated_idx` ON `lead_monthly_goals` (`updatedAt`);--> statement-breakpoint
CREATE INDEX `leads_import_date_idx` ON `leads` (`importId`,`correctedDate`);--> statement-breakpoint
CREATE INDEX `leads_date_channel_idx` ON `leads` (`correctedDate`,`channel`);--> statement-breakpoint
CREATE INDEX `leads_date_model_idx` ON `leads` (`correctedDate`,`model`);--> statement-breakpoint
CREATE INDEX `leads_date_region_idx` ON `leads` (`correctedDate`,`region`);--> statement-breakpoint
CREATE INDEX `leads_date_dealer_idx` ON `leads` (`correctedDate`,`dealerName`);