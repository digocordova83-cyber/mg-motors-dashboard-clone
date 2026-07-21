CREATE TABLE `campaign_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` varchar(32) NOT NULL,
	`competencia` varchar(7) NOT NULL,
	`goalType` enum('MEDIA_BUDGET','REGIONAL_LEADS') NOT NULL,
	`scopeKey` varchar(120) NOT NULL,
	`region` varchar(120),
	`monthlyLeadGoal` int,
	`monthlyBudgetGoal` decimal(16,2),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` varchar(120) NOT NULL,
	`updatedBy` varchar(120) NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `campaign_goals_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaign_goals_scope_unique` UNIQUE(`accountId`,`competencia`,`goalType`,`scopeKey`)
);
--> statement-breakpoint
CREATE TABLE `optimization_cycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleNumber` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`startDate` varchar(10) NOT NULL,
	`endDate` varchar(10),
	`status` enum('ACTIVE','CLOSED') NOT NULL DEFAULT 'ACTIVE',
	`carriedFromCycleId` int,
	`createdBy` varchar(120) NOT NULL,
	`closedBy` varchar(120),
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	`closedAt` bigint,
	CONSTRAINT `optimization_cycles_id` PRIMARY KEY(`id`),
	CONSTRAINT `optimization_cycles_number_unique` UNIQUE(`cycleNumber`)
);
--> statement-breakpoint
CREATE TABLE `optimization_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleId` int NOT NULL,
	`campaignId` varchar(64) NOT NULL,
	`campaignName` varchar(255) NOT NULL,
	`region` varchar(120),
	`monthlyLeadGoal` int,
	`actionType` varchar(80) NOT NULL,
	`description` text NOT NULL,
	`rationale` text NOT NULL,
	`evidence` json NOT NULL,
	`steps` json NOT NULL,
	`expectedImpact` text NOT NULL,
	`risk` text NOT NULL,
	`priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
	`status` enum('PENDING','IN_PROGRESS','COMPLETED','REOPENED') NOT NULL DEFAULT 'PENDING',
	`sourceSignature` varchar(255) NOT NULL,
	`sourceTaskId` int,
	`createdBy` varchar(120) NOT NULL,
	`assignee` varchar(120),
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	`startedAt` bigint,
	`completedAt` bigint,
	CONSTRAINT `optimization_tasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `optimization_tasks_cycle_signature_unique` UNIQUE(`cycleId`,`sourceSignature`)
);
--> statement-breakpoint
CREATE TABLE `performance_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleId` int,
	`taskId` int,
	`campaignId` varchar(64) NOT NULL,
	`campaignName` varchar(255) NOT NULL,
	`snapshotType` enum('CYCLE_START','TASK_CREATED','TASK_COMPLETED','FOLLOW_UP') NOT NULL,
	`snapshotDate` varchar(10) NOT NULL,
	`windowDateFrom` varchar(10) NOT NULL,
	`windowDateTo` varchar(10) NOT NULL,
	`spend` decimal(16,4) NOT NULL,
	`conversions` decimal(16,4) NOT NULL,
	`cpa` decimal(16,4) NOT NULL,
	`ctr` decimal(12,6) NOT NULL,
	`cpc` decimal(16,4) NOT NULL,
	`clicks` decimal(16,2) NOT NULL,
	`impressions` decimal(18,2) NOT NULL,
	`dailyBudget` decimal(16,4),
	`optimizationScore` decimal(12,6),
	`searchImpressionShare` decimal(12,6),
	`createdAt` bigint NOT NULL,
	CONSTRAINT `performance_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `performance_snapshots_identity_unique` UNIQUE(`taskId`,`snapshotType`,`windowDateFrom`,`windowDateTo`)
);
--> statement-breakpoint
CREATE TABLE `task_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`completedBy` varchar(120) NOT NULL,
	`completedAt` bigint NOT NULL,
	`notes` text NOT NULL,
	CONSTRAINT `task_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `task_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`cycleId` int NOT NULL,
	`eventType` enum('CREATED','ASSIGNED','STARTED','COMPLETED','REOPENED','TRANSFERRED_IN','TRANSFERRED_OUT') NOT NULL,
	`actor` varchar(120) NOT NULL,
	`notes` text,
	`metadata` json,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `task_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `optimization_tasks` ADD CONSTRAINT `optimization_tasks_cycleId_optimization_cycles_id_fk` FOREIGN KEY (`cycleId`) REFERENCES `optimization_cycles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_snapshots` ADD CONSTRAINT `performance_snapshots_cycleId_optimization_cycles_id_fk` FOREIGN KEY (`cycleId`) REFERENCES `optimization_cycles`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_snapshots` ADD CONSTRAINT `performance_snapshots_taskId_optimization_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `optimization_tasks`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_completions` ADD CONSTRAINT `task_completions_taskId_optimization_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `optimization_tasks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_events` ADD CONSTRAINT `task_events_taskId_optimization_tasks_id_fk` FOREIGN KEY (`taskId`) REFERENCES `optimization_tasks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `task_events` ADD CONSTRAINT `task_events_cycleId_optimization_cycles_id_fk` FOREIGN KEY (`cycleId`) REFERENCES `optimization_cycles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `campaign_goals_competencia_idx` ON `campaign_goals` (`accountId`,`competencia`,`isActive`);--> statement-breakpoint
CREATE INDEX `optimization_cycles_status_idx` ON `optimization_cycles` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `optimization_tasks_cycle_status_idx` ON `optimization_tasks` (`cycleId`,`status`,`priority`);--> statement-breakpoint
CREATE INDEX `optimization_tasks_campaign_idx` ON `optimization_tasks` (`campaignId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `optimization_tasks_assignee_idx` ON `optimization_tasks` (`assignee`,`status`);--> statement-breakpoint
CREATE INDEX `performance_snapshots_campaign_idx` ON `performance_snapshots` (`campaignId`,`snapshotDate`);--> statement-breakpoint
CREATE INDEX `performance_snapshots_cycle_idx` ON `performance_snapshots` (`cycleId`,`snapshotDate`);--> statement-breakpoint
CREATE INDEX `task_completions_task_idx` ON `task_completions` (`taskId`,`completedAt`);--> statement-breakpoint
CREATE INDEX `task_events_task_idx` ON `task_events` (`taskId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `task_events_actor_idx` ON `task_events` (`actor`,`createdAt`);