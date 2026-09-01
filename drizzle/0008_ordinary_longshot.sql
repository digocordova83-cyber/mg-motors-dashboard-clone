CREATE TABLE `dashboard_access_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int,
	`username` varchar(64) NOT NULL,
	`eventType` enum('LOGIN_SUCCESS','LOGIN_FAILURE','LOGOUT') NOT NULL,
	`ipAddress` varchar(64),
	`userAgent` varchar(512),
	`occurredAt` bigint NOT NULL,
	CONSTRAINT `dashboard_access_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dashboard_accounts` ADD `canAccessAccessHistory` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `dashboard_access_events` ADD CONSTRAINT `dashboard_access_events_accountId_dashboard_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `dashboard_accounts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `dashboard_access_events_occurred_idx` ON `dashboard_access_events` (`occurredAt`);--> statement-breakpoint
CREATE INDEX `dashboard_access_events_username_occurred_idx` ON `dashboard_access_events` (`username`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `dashboard_access_events_type_occurred_idx` ON `dashboard_access_events` (`eventType`,`occurredAt`);