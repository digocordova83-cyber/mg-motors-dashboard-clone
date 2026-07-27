CREATE TABLE `optimization_negative_keywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`cycleId` int NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`campaignId` varchar(64) NOT NULL,
	`campaignName` varchar(255) NOT NULL,
	`term` varchar(500) NOT NULL,
	`normalizedTerm` varchar(500) NOT NULL,
	`matchType` enum('BROAD','PHRASE','EXACT') NOT NULL,
	`origin` enum('TASK_COMPLETION','MANUAL') NOT NULL DEFAULT 'TASK_COMPLETION',
	`appliedBy` varchar(120) NOT NULL,
	`appliedAt` bigint NOT NULL,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `optimization_negative_keywords_id` PRIMARY KEY(`id`),
	CONSTRAINT `optimization_negative_keywords_task_term_unique` UNIQUE(`taskId`,`normalizedTerm`,`matchType`)
);
--> statement-breakpoint
ALTER TABLE `optimization_negative_keywords` ADD CONSTRAINT `optimization_negative_keywords_taskId_optimization_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `optimization_tasks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `optimization_negative_keywords` ADD CONSTRAINT `optimization_negative_keywords_cycleId_optimization_cycles_id_fk` FOREIGN KEY (`cycleId`) REFERENCES `optimization_cycles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `optimization_negative_keywords_campaign_idx` ON `optimization_negative_keywords` (`campaignId`,`appliedAt`);--> statement-breakpoint
CREATE INDEX `optimization_negative_keywords_cycle_idx` ON `optimization_negative_keywords` (`cycleId`,`appliedAt`);