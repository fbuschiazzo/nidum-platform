import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type ApiResult<T> = { data: T } | { error: string; details?: unknown };

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(normalize(data), init);
}

export function badRequest(error: string, details?: unknown) {
  return json({ error, details }, { status: 400 });
}

export function notFound(error = "Resource not found") {
  return json({ error }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error(error);
  return json({ error: "Internal server error" }, { status: 500 });
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

export function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function decimal(value: unknown, field: string) {
  const parsed = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${field} must be a positive number`);
  }
  return new Prisma.Decimal(parsed);
}

export function percentage(value: unknown, field: string) {
  const parsed = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 100) {
    throw new Error(`${field} must be a number greater than 0 and up to 100`);
  }
  return parsed;
}

export function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Expected a valid number");
  return parsed;
}

export function optionalDate(value: unknown) {
  if (!value) return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Expected a valid date");
  return date;
}

export function pagination(searchParams: URLSearchParams) {
  const take = Math.min(Number(searchParams.get("take") ?? 25), 100);
  const skip = Number(searchParams.get("skip") ?? 0);
  return {
    take: Number.isFinite(take) && take > 0 ? take : 25,
    skip: Number.isFinite(skip) && skip >= 0 ? skip : 0,
  };
}

export function normalize(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) return value.toNumber();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)]));
  }
  return value;
}
