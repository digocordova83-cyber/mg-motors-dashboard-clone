import {
  bigint,
  boolean,
  date,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const dashboardAccounts = mysqlTable(
  "dashboard_accounts",
  {
    id: int("id").autoincrement().primaryKey(),
    username: varchar("username", { length: 64 }).notNull(),
    displayName: varchar("displayName", { length: 120 }).notNull(),
    passwordHash: text("passwordHash").notNull(),
    locale: mysqlEnum("locale", ["pt-BR", "en-US"]).default("pt-BR").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    canAccessGoogleAds: boolean("canAccessGoogleAds").default(true).notNull(),
    canAccessMetaAds: boolean("canAccessMetaAds").default(true).notNull(),
    canAccessLeads: boolean("canAccessLeads").default(true).notNull(),
    canAccessMediaPlan: boolean("canAccessMediaPlan").default(true).notNull(),
    canAccessOptimizations: boolean("canAccessOptimizations").default(false).notNull(),
    canAccessHistory: boolean("canAccessHistory").default(false).notNull(),
    canImportLeads: boolean("canImportLeads").default(false).notNull(),
    canAccessAccessHistory: boolean("canAccessAccessHistory").default(false).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
    lastSignedInAt: bigint("lastSignedInAt", { mode: "number" }),
  },
  table => [
    uniqueIndex("dashboard_accounts_username_unique").on(table.username),
    index("dashboard_accounts_active_idx").on(table.isActive, table.username),
  ],
);

export const dashboardAccessEvents = mysqlTable(
  "dashboard_access_events",
  {
    id: int("id").autoincrement().primaryKey(),
    accountId: int("accountId").references(() => dashboardAccounts.id, { onDelete: "set null" }),
    username: varchar("username", { length: 64 }).notNull(),
    eventType: mysqlEnum("eventType", ["LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT"]).notNull(),
    ipAddress: varchar("ipAddress", { length: 64 }),
    userAgent: varchar("userAgent", { length: 512 }),
    occurredAt: bigint("occurredAt", { mode: "number" }).notNull(),
  },
  table => [
    index("dashboard_access_events_occurred_idx").on(table.occurredAt),
    index("dashboard_access_events_username_occurred_idx").on(table.username, table.occurredAt),
    index("dashboard_access_events_type_occurred_idx").on(table.eventType, table.occurredAt),
  ],
);

export const dashboardSourceRefreshes = mysqlTable(
  "dashboard_source_refreshes",
  {
    id: int("id").autoincrement().primaryKey(),
    source: mysqlEnum("source", ["GOOGLE_ADS", "META_ADS"]).notNull(),
    refreshDate: date("refreshDate", { mode: "string" }).notNull(),
    periodFrom: date("periodFrom", { mode: "string" }).notNull(),
    periodTo: date("periodTo", { mode: "string" }).notNull(),
    lastAttemptStatus: mysqlEnum("lastAttemptStatus", ["SUCCESS", "FAILED"]).notNull(),
    attemptCount: int("attemptCount").default(1).notNull(),
    lastAttemptAt: bigint("lastAttemptAt", { mode: "number" }).notNull(),
    lastSuccessAt: bigint("lastSuccessAt", { mode: "number" }),
    lastSuccessSource: varchar("lastSuccessSource", { length: 64 }),
    lastSuccessMetadata: json("lastSuccessMetadata")
      .$type<Record<string, number | string | boolean | null>>()
      .notNull(),
    lastError: text("lastError"),
    taskUid: varchar("taskUid", { length: 65 }),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("dashboard_source_refreshes_source_date_unique").on(
      table.source,
      table.refreshDate,
    ),
    index("dashboard_source_refreshes_status_attempt_idx").on(
      table.lastAttemptStatus,
      table.lastAttemptAt,
    ),
    index("dashboard_source_refreshes_task_uid_idx").on(table.taskUid),
  ],
);

export const dashboardDataSnapshots = mysqlTable(
  "dashboard_data_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    source: mysqlEnum("source", ["GOOGLE_ADS", "META_ADS"]).notNull(),
    periodFrom: date("periodFrom", { mode: "string" }).notNull(),
    periodTo: date("periodTo", { mode: "string" }).notNull(),
    dataThroughDate: date("dataThroughDate", { mode: "string" }).notNull(),
    sourceName: varchar("sourceName", { length: 64 }).notNull(),
    payload: json("payload").$type<Record<string, unknown>>().notNull(),
    refreshedAt: bigint("refreshedAt", { mode: "number" }).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("dashboard_data_snapshots_source_period_unique").on(
      table.source,
      table.periodFrom,
      table.periodTo,
    ),
    index("dashboard_data_snapshots_period_idx").on(
      table.source,
      table.periodTo,
      table.refreshedAt,
    ),
  ],
);

export const campaignGoals = mysqlTable(
  "campaign_goals",
  {
    id: int("id").autoincrement().primaryKey(),
    accountId: varchar("accountId", { length: 32 }).notNull(),
    competencia: varchar("competencia", { length: 7 }).notNull(),
    goalType: mysqlEnum("goalType", ["MEDIA_BUDGET", "REGIONAL_LEADS"]).notNull(),
    scopeKey: varchar("scopeKey", { length: 120 }).notNull(),
    region: varchar("region", { length: 120 }),
    monthlyLeadGoal: int("monthlyLeadGoal"),
    monthlyBudgetGoal: decimal("monthlyBudgetGoal", { precision: 16, scale: 2 }),
    isActive: boolean("isActive").default(true).notNull(),
    createdBy: varchar("createdBy", { length: 120 }).notNull(),
    updatedBy: varchar("updatedBy", { length: 120 }).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("campaign_goals_scope_unique").on(
      table.accountId,
      table.competencia,
      table.goalType,
      table.scopeKey,
    ),
    index("campaign_goals_competencia_idx").on(table.accountId, table.competencia, table.isActive),
  ],
);

export const optimizationCycles = mysqlTable(
  "optimization_cycles",
  {
    id: int("id").autoincrement().primaryKey(),
    cycleNumber: int("cycleNumber").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    startDate: varchar("startDate", { length: 10 }).notNull(),
    endDate: varchar("endDate", { length: 10 }),
    status: mysqlEnum("status", ["ACTIVE", "CLOSED"]).default("ACTIVE").notNull(),
    carriedFromCycleId: int("carriedFromCycleId"),
    createdBy: varchar("createdBy", { length: 120 }).notNull(),
    closedBy: varchar("closedBy", { length: 120 }),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
    closedAt: bigint("closedAt", { mode: "number" }),
  },
  table => [
    uniqueIndex("optimization_cycles_number_unique").on(table.cycleNumber),
    index("optimization_cycles_status_idx").on(table.status, table.createdAt),
  ],
);

export const optimizationTasks = mysqlTable(
  "optimization_tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    cycleId: int("cycleId")
      .notNull()
      .references(() => optimizationCycles.id, { onDelete: "cascade" }),
    campaignId: varchar("campaignId", { length: 64 }).notNull(),
    campaignName: varchar("campaignName", { length: 255 }).notNull(),
    region: varchar("region", { length: 120 }),
    monthlyLeadGoal: int("monthlyLeadGoal"),
    actionType: varchar("actionType", { length: 80 }).notNull(),
    description: text("description").notNull(),
    rationale: text("rationale").notNull(),
    evidence: json("evidence").$type<Record<string, number | string | boolean | null>>().notNull(),
    steps: json("steps").$type<string[]>().notNull(),
    expectedImpact: text("expectedImpact").notNull(),
    risk: text("risk").notNull(),
    priority: mysqlEnum("priority", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).notNull(),
    status: mysqlEnum("status", ["PENDING", "IN_PROGRESS", "COMPLETED", "REOPENED"])
      .default("PENDING")
      .notNull(),
    sourceSignature: varchar("sourceSignature", { length: 255 }).notNull(),
    sourceTaskId: int("sourceTaskId"),
    createdBy: varchar("createdBy", { length: 120 }).notNull(),
    assignee: varchar("assignee", { length: 120 }),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
    startedAt: bigint("startedAt", { mode: "number" }),
    completedAt: bigint("completedAt", { mode: "number" }),
  },
  table => [
    uniqueIndex("optimization_tasks_cycle_signature_unique").on(table.cycleId, table.sourceSignature),
    index("optimization_tasks_cycle_status_idx").on(table.cycleId, table.status, table.priority),
    index("optimization_tasks_campaign_idx").on(table.campaignId, table.createdAt),
    index("optimization_tasks_assignee_idx").on(table.assignee, table.status),
  ],
);

export const taskCompletions = mysqlTable(
  "task_completions",
  {
    id: int("id").autoincrement().primaryKey(),
    taskId: int("taskId")
      .notNull()
      .references(() => optimizationTasks.id, { onDelete: "cascade" }),
    completedBy: varchar("completedBy", { length: 120 }).notNull(),
    completedAt: bigint("completedAt", { mode: "number" }).notNull(),
    notes: text("notes").notNull(),
  },
  table => [index("task_completions_task_idx").on(table.taskId, table.completedAt)],
);

export const taskEvents = mysqlTable(
  "task_events",
  {
    id: int("id").autoincrement().primaryKey(),
    taskId: int("taskId")
      .notNull()
      .references(() => optimizationTasks.id, { onDelete: "cascade" }),
    cycleId: int("cycleId")
      .notNull()
      .references(() => optimizationCycles.id, { onDelete: "cascade" }),
    eventType: mysqlEnum("eventType", [
      "CREATED",
      "ASSIGNED",
      "STARTED",
      "COMPLETED",
      "REOPENED",
      "TRANSFERRED_IN",
      "TRANSFERRED_OUT",
    ]).notNull(),
    actor: varchar("actor", { length: 120 }).notNull(),
    notes: text("notes"),
    metadata: json("metadata").$type<Record<string, number | string | boolean | null>>(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  },
  table => [
    index("task_events_task_idx").on(table.taskId, table.createdAt),
    index("task_events_actor_idx").on(table.actor, table.createdAt),
  ],
);

export const performanceSnapshots = mysqlTable(
  "performance_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    cycleId: int("cycleId").references(() => optimizationCycles.id, { onDelete: "set null" }),
    taskId: int("taskId").references(() => optimizationTasks.id, { onDelete: "set null" }),
    campaignId: varchar("campaignId", { length: 64 }).notNull(),
    campaignName: varchar("campaignName", { length: 255 }).notNull(),
    snapshotType: mysqlEnum("snapshotType", [
      "CYCLE_START",
      "TASK_CREATED",
      "TASK_COMPLETED",
      "FOLLOW_UP",
    ]).notNull(),
    snapshotDate: varchar("snapshotDate", { length: 10 }).notNull(),
    windowDateFrom: varchar("windowDateFrom", { length: 10 }).notNull(),
    windowDateTo: varchar("windowDateTo", { length: 10 }).notNull(),
    spend: decimal("spend", { precision: 16, scale: 4 }).notNull(),
    conversions: decimal("conversions", { precision: 16, scale: 4 }).notNull(),
    cpa: decimal("cpa", { precision: 16, scale: 4 }).notNull(),
    ctr: decimal("ctr", { precision: 12, scale: 6 }).notNull(),
    cpc: decimal("cpc", { precision: 16, scale: 4 }).notNull(),
    clicks: decimal("clicks", { precision: 16, scale: 2 }).notNull(),
    impressions: decimal("impressions", { precision: 18, scale: 2 }).notNull(),
    dailyBudget: decimal("dailyBudget", { precision: 16, scale: 4 }),
    optimizationScore: decimal("optimizationScore", { precision: 12, scale: 6 }),
    searchImpressionShare: decimal("searchImpressionShare", { precision: 12, scale: 6 }),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("performance_snapshots_identity_unique").on(
      table.taskId,
      table.snapshotType,
      table.windowDateFrom,
      table.windowDateTo,
    ),
    index("performance_snapshots_campaign_idx").on(table.campaignId, table.snapshotDate),
    index("performance_snapshots_cycle_idx").on(table.cycleId, table.snapshotDate),
  ],
);

export const leadImports = mysqlTable(
  "lead_imports",
  {
    id: int("id").autoincrement().primaryKey(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileHash: varchar("fileHash", { length: 64 }).notNull(),
    fileSizeBytes: int("fileSizeBytes").notNull(),
    fileKey: varchar("fileKey", { length: 512 }),
    fileUrl: text("fileUrl"),
    status: mysqlEnum("status", ["PROCESSING", "COMPLETED", "FAILED"])
      .default("PROCESSING")
      .notNull(),
    rowsTotal: int("rowsTotal").default(0).notNull(),
    rowsInserted: int("rowsInserted").default(0).notNull(),
    rowsSkipped: int("rowsSkipped").default(0).notNull(),
    rowsInvalid: int("rowsInvalid").default(0).notNull(),
    fallbackDateUsed: date("fallbackDateUsed", { mode: "string" }),
    fallbackDateCount: int("fallbackDateCount").default(0).notNull(),
    errorSummary: json("errorSummary").$type<string[]>(),
    importedBy: varchar("importedBy", { length: 120 }).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    completedAt: bigint("completedAt", { mode: "number" }),
  },
  table => [
    uniqueIndex("lead_imports_file_hash_unique").on(table.fileHash),
    index("lead_imports_status_created_idx").on(table.status, table.createdAt),
  ],
);

export const leads = mysqlTable(
  "leads",
  {
    id: int("id").autoincrement().primaryKey(),
    importId: int("importId")
      .notNull()
      .references(() => leadImports.id, { onDelete: "restrict" }),
    sourceRowNumber: int("sourceRowNumber").notNull(),
    recordHash: varchar("recordHash", { length: 64 }).notNull(),
    contentHash: varchar("contentHash", { length: 64 }).notNull(),
    correctedDate: date("correctedDate", { mode: "string" }).notNull(),
    correctedDateRaw: varchar("correctedDateRaw", { length: 64 }).notNull(),
    sourceDateRaw: text("sourceDateRaw").notNull(),
    channel: varchar("channel", { length: 120 }).notNull(),
    channelRaw: varchar("channelRaw", { length: 255 }).notNull(),
    model: varchar("model", { length: 120 }).notNull(),
    modelRaw: varchar("modelRaw", { length: 255 }).notNull(),
    region: varchar("region", { length: 32 }).notNull(),
    regionRaw: varchar("regionRaw", { length: 255 }).notNull(),
    city: varchar("city", { length: 160 }).notNull(),
    cityRaw: varchar("cityRaw", { length: 255 }).notNull(),
    dealerName: varchar("dealerName", { length: 255 }).notNull(),
    dealerRaw: varchar("dealerRaw", { length: 255 }).notNull(),
    contactName: text("contactName").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull(),
    rawPayload: json("rawPayload")
      .$type<{
        sourceDate: string;
        model: string;
        region: string;
        city: string;
        dealer: string;
        correctedDealer: string;
        name: string;
        email: string;
        phone: string;
        channel: string;
        correctedDate: string;
      }>()
      .notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("leads_record_hash_unique").on(table.recordHash),
    uniqueIndex("leads_content_hash_unique").on(table.contentHash),
    index("leads_import_date_idx").on(table.importId, table.correctedDate),
    index("leads_date_channel_idx").on(table.correctedDate, table.channel),
    index("leads_date_model_idx").on(table.correctedDate, table.model),
    index("leads_date_region_idx").on(table.correctedDate, table.region),
    index("leads_date_dealer_idx").on(table.correctedDate, table.dealerName),
  ],
);

export const leadMonthlyGoals = mysqlTable(
  "lead_monthly_goals",
  {
    id: int("id").autoincrement().primaryKey(),
    competencia: varchar("competencia", { length: 7 }).notNull(),
    goalCount: int("goalCount").notNull(),
    createdBy: varchar("createdBy", { length: 120 }).notNull(),
    updatedBy: varchar("updatedBy", { length: 120 }).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("lead_monthly_goals_competencia_unique").on(table.competencia),
    index("lead_monthly_goals_updated_idx").on(table.updatedAt),
  ],
);

export const weeklySalesImports = mysqlTable(
  "weekly_sales_imports",
  {
    id: int("id").autoincrement().primaryKey(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileHash: varchar("fileHash", { length: 64 }).notNull(),
    fileSizeBytes: int("fileSizeBytes").notNull(),
    fileKey: varchar("fileKey", { length: 512 }),
    fileUrl: text("fileUrl"),
    competence: varchar("competence", { length: 7 }).notNull(),
    referenceWeek: int("referenceWeek").default(4).notNull(),
    status: mysqlEnum("status", ["PROCESSING", "COMPLETED", "FAILED"])
      .default("PROCESSING")
      .notNull(),
    rowsTotal: int("rowsTotal").default(0).notNull(),
    dealerRows: int("dealerRows").default(0).notNull(),
    regionRows: int("regionRows").default(0).notNull(),
    totalRows: int("totalRows").default(0).notNull(),
    rowsInserted: int("rowsInserted").default(0).notNull(),
    rowsInvalid: int("rowsInvalid").default(0).notNull(),
    matchedDealerRows: int("matchedDealerRows").default(0).notNull(),
    unmatchedDealerRows: int("unmatchedDealerRows").default(0).notNull(),
    dealersWithoutWeek4Sales: int("dealersWithoutWeek4Sales").default(0).notNull(),
    week4DealerSalesTotal: int("week4DealerSalesTotal"),
    week4RegionSalesTotal: int("week4RegionSalesTotal"),
    week4ReportedSalesTotal: int("week4ReportedSalesTotal"),
    reconciliationPassed: boolean("reconciliationPassed").default(false).notNull(),
    errorSummary: json("errorSummary").$type<string[]>(),
    importedBy: varchar("importedBy", { length: 120 }).notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
    completedAt: bigint("completedAt", { mode: "number" }),
  },
  table => [
    uniqueIndex("weekly_sales_imports_file_competence_unique").on(
      table.fileHash,
      table.competence,
    ),
    index("weekly_sales_imports_competence_status_idx").on(
      table.competence,
      table.status,
      table.createdAt,
    ),
  ],
);

export const weeklySalesRecords = mysqlTable(
  "weekly_sales_records",
  {
    id: int("id").autoincrement().primaryKey(),
    importId: int("importId")
      .notNull()
      .references(() => weeklySalesImports.id, { onDelete: "cascade" }),
    competence: varchar("competence", { length: 7 }).notNull(),
    sourceRowNumber: int("sourceRowNumber").notNull(),
    rowType: mysqlEnum("rowType", ["DEALER", "REGION", "TOTAL"]).notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceKey: varchar("sourceKey", { length: 255 }).notNull(),
    canonicalDealer: varchar("canonicalDealer", { length: 255 }),
    canonicalDealerKey: varchar("canonicalDealerKey", { length: 255 }),
    matchStatus: mysqlEnum("matchStatus", ["MATCHED", "UNMATCHED", "AGGREGATE"]).notNull(),
    recordHash: varchar("recordHash", { length: 64 }).notNull(),
    week1Target: decimal("week1Target", { precision: 12, scale: 2 }),
    week1Retail: int("week1Retail"),
    week1Achievement: decimal("week1Achievement", { precision: 12, scale: 2 }),
    week2Target: decimal("week2Target", { precision: 12, scale: 2 }),
    week2Retail: int("week2Retail"),
    week2Achievement: decimal("week2Achievement", { precision: 12, scale: 2 }),
    week3Target: decimal("week3Target", { precision: 12, scale: 2 }),
    week3Retail: int("week3Retail"),
    week3Achievement: decimal("week3Achievement", { precision: 12, scale: 2 }),
    week4Target: decimal("week4Target", { precision: 12, scale: 2 }),
    week4Retail: int("week4Retail"),
    week4Achievement: decimal("week4Achievement", { precision: 12, scale: 2 }),
    week5Target: decimal("week5Target", { precision: 12, scale: 2 }),
    week5Retail: int("week5Retail"),
    week5Achievement: decimal("week5Achievement", { precision: 12, scale: 2 }),
    rawPayload: json("rawPayload")
      .$type<{
        tokens: string[];
        weeks: Record<
          string,
          { target: number | null; retail: number | null; achievementPercent: number | null }
        >;
      }>()
      .notNull(),
    createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  },
  table => [
    uniqueIndex("weekly_sales_records_import_row_unique").on(
      table.importId,
      table.sourceRowNumber,
    ),
    index("weekly_sales_records_competence_dealer_idx").on(
      table.competence,
      table.canonicalDealer,
    ),
    index("weekly_sales_records_import_type_idx").on(table.importId, table.rowType),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type DashboardAccount = typeof dashboardAccounts.$inferSelect;
export type InsertDashboardAccount = typeof dashboardAccounts.$inferInsert;
export type DashboardAccessEvent = typeof dashboardAccessEvents.$inferSelect;
export type InsertDashboardAccessEvent = typeof dashboardAccessEvents.$inferInsert;
export type DashboardSourceRefresh = typeof dashboardSourceRefreshes.$inferSelect;
export type InsertDashboardSourceRefresh = typeof dashboardSourceRefreshes.$inferInsert;
export type CampaignGoal = typeof campaignGoals.$inferSelect;
export type InsertCampaignGoal = typeof campaignGoals.$inferInsert;
export type OptimizationCycle = typeof optimizationCycles.$inferSelect;
export type InsertOptimizationCycle = typeof optimizationCycles.$inferInsert;
export type OptimizationTask = typeof optimizationTasks.$inferSelect;
export type InsertOptimizationTask = typeof optimizationTasks.$inferInsert;
export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type InsertTaskCompletion = typeof taskCompletions.$inferInsert;
export type TaskEvent = typeof taskEvents.$inferSelect;
export type InsertTaskEvent = typeof taskEvents.$inferInsert;
export type PerformanceSnapshot = typeof performanceSnapshots.$inferSelect;
export type InsertPerformanceSnapshot = typeof performanceSnapshots.$inferInsert;
export type LeadImport = typeof leadImports.$inferSelect;
export type InsertLeadImport = typeof leadImports.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type LeadMonthlyGoal = typeof leadMonthlyGoals.$inferSelect;
export type InsertLeadMonthlyGoal = typeof leadMonthlyGoals.$inferInsert;
export type WeeklySalesImport = typeof weeklySalesImports.$inferSelect;
export type InsertWeeklySalesImport = typeof weeklySalesImports.$inferInsert;
export type WeeklySalesRecord = typeof weeklySalesRecords.$inferSelect;
export type InsertWeeklySalesRecord = typeof weeklySalesRecords.$inferInsert;
