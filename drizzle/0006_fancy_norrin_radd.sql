ALTER TABLE `lead_imports` ADD `fallbackDateUsed` date;--> statement-breakpoint
ALTER TABLE `lead_imports` ADD `fallbackDateCount` int DEFAULT 0 NOT NULL;