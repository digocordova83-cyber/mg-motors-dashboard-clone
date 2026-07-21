import { timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { parse } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import { getSessionCookieOptions } from "./_core/cookies";

export const DASHBOARD_SESSION_COOKIE = "mg_motors_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const DASHBOARD_USERNAME = "rodrigo";
const DASHBOARD_PASSWORD = "rodrigo";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não está configurado");
  return new TextEncoder().encode(secret);
}

function safeEqual(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function validateDashboardCredentials(username: string, password: string) {
  return safeEqual(username.trim(), DASHBOARD_USERNAME) && safeEqual(password, DASHBOARD_PASSWORD);
}

export async function createDashboardSession() {
  return new SignJWT({ scope: "mg-motors-dashboard" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(DASHBOARD_USERNAME)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function readDashboardSession(req: Request) {
  const cookies = parse(req.headers.cookie ?? "");
  const token = cookies[DASHBOARD_SESSION_COOKIE];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (payload.scope !== "mg-motors-dashboard" || payload.sub !== DASHBOARD_USERNAME) return null;
    return { username: DASHBOARD_USERNAME, expiresAt: (payload.exp ?? 0) * 1000 };
  } catch {
    return null;
  }
}

export async function setDashboardSession(res: Response, req: Request) {
  const token = await createDashboardSession();
  res.cookie(DASHBOARD_SESSION_COOKIE, token, {
    ...getSessionCookieOptions(req),
    maxAge: SESSION_DURATION_SECONDS * 1000,
  });
}

export function clearDashboardSession(res: Response, req: Request) {
  res.clearCookie(DASHBOARD_SESSION_COOKIE, {
    ...getSessionCookieOptions(req),
    maxAge: -1,
  });
}
