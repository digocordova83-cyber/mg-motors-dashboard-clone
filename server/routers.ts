import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  clearDashboardSession,
  readDashboardSession,
  setDashboardSession,
  validateDashboardCredentials,
} from "./dashboardAuth";
import { loadDashboardData } from "./dashboardService";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const dashboardProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await readDashboardSession(ctx.req);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida ou expirada" });
  }
  return next({ ctx: { ...ctx, dashboardSession: session } });
});

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboardAuth: router({
    session: publicProcedure.query(async ({ ctx }) => readDashboardSession(ctx.req)),
    login: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!validateDashboardCredentials(input.username, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos" });
        }
        await setDashboardSession(ctx.res, ctx.req);
        return { success: true, username: "rodrigo" } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearDashboardSession(ctx.res, ctx.req);
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    getData: dashboardProcedure
      .input(
        z
          .object({ dateFrom: dateSchema, dateTo: dateSchema })
          .refine(input => input.dateFrom <= input.dateTo, "A data inicial deve anteceder a data final"),
      )
      .query(({ input }) => loadDashboardData(input.dateFrom, input.dateTo)),
  }),
});

export type AppRouter = typeof appRouter;
