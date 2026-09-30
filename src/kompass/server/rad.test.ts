import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { sammanstall } from "@/kompass/lib/sammanstallning";
import { RAD_KOLUMNER } from "@/kompass/server/rad";

/**
 * Kolumnerna i kompass_svar enligt schema.sql: de i create table plus de som
 * läggs till med "add column if not exists".
 */
function schemakolumner(): { skapade: Set<string>; tillagda: Set<string> } {
  const sql = readFileSync(join(process.cwd(), "supabase/schema.sql"), "utf8");
  const tabell = sql.slice(
    sql.indexOf("create table if not exists kompass_svar ("),
    sql.indexOf("\n);", sql.indexOf("create table if not exists kompass_svar (")),
  );
  const skapade = new Set(
    [...tabell.matchAll(/^\s{2}([a-z_]+)\s/gm)].map((m) => m[1]),
  );
  const tillagda = new Set(
    [...sql.matchAll(/alter table kompass_svar add column if not exists ([a-z_]+)/g)].map(
      (m) => m[1],
    ),
  );
  return { skapade, tillagda };
}

describe("databasschemat", () => {
  const { skapade, tillagda } = schemakolumner();

  it("har varje kolumn som servern läser", () => {
    const saknas = RAD_KOLUMNER.split(",")
      .map((k) => k.trim())
      .filter((k) => !skapade.has(k));
    expect(saknas).toEqual([]);
  });

  it("har varje kolumn som sparandet skriver", () => {
    const saknas = Object.keys(sammanstall({})).filter((k) => !skapade.has(k));
    expect(saknas).toEqual([]);
  });

  // En kolumn som bara finns i create table når aldrig en befintlig databas.
  it("lägger till senare kolumner även i en befintlig tabell", () => {
    expect([...tillagda].filter((k) => !skapade.has(k))).toEqual([]);
    expect(tillagda.has("mal")).toBe(true);
  });

  it("har en migreringsfil för varje tillagd kolumn", () => {
    const dir = join(process.cwd(), "supabase/migrations");
    const migreringar = readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .map((f) => readFileSync(join(dir, f), "utf8"))
      .join("\n");
    for (const k of tillagda) {
      expect(migreringar, k).toContain(`add column if not exists ${k}`);
    }
  });
});
