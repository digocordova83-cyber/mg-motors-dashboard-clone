CREATE TABLE `dashboard_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`passwordHash` text NOT NULL,
	`locale` enum('pt-BR','en-US') NOT NULL DEFAULT 'pt-BR',
	`isActive` boolean NOT NULL DEFAULT true,
	`canAccessGoogleAds` boolean NOT NULL DEFAULT true,
	`canAccessMetaAds` boolean NOT NULL DEFAULT true,
	`canAccessLeads` boolean NOT NULL DEFAULT true,
	`canAccessMediaPlan` boolean NOT NULL DEFAULT true,
	`canAccessOptimizations` boolean NOT NULL DEFAULT false,
	`canAccessHistory` boolean NOT NULL DEFAULT false,
	`canImportLeads` boolean NOT NULL DEFAULT false,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	`lastSignedInAt` bigint,
	CONSTRAINT `dashboard_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `dashboard_accounts_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE INDEX `dashboard_accounts_active_idx` ON `dashboard_accounts` (`isActive`,`username`);