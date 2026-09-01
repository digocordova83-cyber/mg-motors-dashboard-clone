CREATE TABLE `dealer_monthly_targets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competence` varchar(7) NOT NULL,
	`sourceRowNumber` int NOT NULL,
	`sourceDealerName` varchar(255) NOT NULL,
	`officialDealerName` varchar(255) NOT NULL,
	`canonicalDealer` varchar(255) NOT NULL,
	`canonicalDealerKey` varchar(255) NOT NULL,
	`stateCode` varchar(2) NOT NULL,
	`leadTarget` int NOT NULL,
	`salesTarget` int NOT NULL,
	`channelTargets` json NOT NULL,
	`weightPercent` decimal(8,4) NOT NULL,
	`conversionInvestment` decimal(14,2) NOT NULL,
	`sourceFileName` varchar(255) NOT NULL,
	`sourceFileHash` varchar(64) NOT NULL,
	`recordHash` varchar(64) NOT NULL,
	`importedBy` varchar(120) NOT NULL,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `dealer_monthly_targets_id` PRIMARY KEY(`id`),
	CONSTRAINT `dealer_monthly_targets_competence_dealer_unique` UNIQUE(`competence`,`canonicalDealerKey`)
);
--> statement-breakpoint
CREATE INDEX `dealer_monthly_targets_competence_state_idx` ON `dealer_monthly_targets` (`competence`,`stateCode`);--> statement-breakpoint
CREATE INDEX `dealer_monthly_targets_source_hash_idx` ON `dealer_monthly_targets` (`sourceFileHash`);