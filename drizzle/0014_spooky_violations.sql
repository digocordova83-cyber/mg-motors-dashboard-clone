ALTER TABLE `dashboard_data_snapshots` MODIFY COLUMN `source` enum('GOOGLE_ADS','META_ADS','TIKTOK_ADS') NOT NULL;--> statement-breakpoint
ALTER TABLE `dashboard_source_refreshes` MODIFY COLUMN `source` enum('GOOGLE_ADS','META_ADS','TIKTOK_ADS') NOT NULL;
--> statement-breakpoint
ALTER TABLE `dashboard_data_snapshots` MODIFY COLUMN `source` enum('GOOGLE_ADS','META_ADS','TIKTOK_ADS') NOT NULL;
