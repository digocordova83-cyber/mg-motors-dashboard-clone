import {
  bigint,
  boolean,
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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
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
