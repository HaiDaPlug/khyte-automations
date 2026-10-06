/**
 * Vaktar att kompassen går att flytta.
 *
 * Hela src/kompass/ ska kunna kopieras till en annan Next.js-app (khyte.se)
 * och fungera direkt. De här testerna säger till så fort något börjar bero på
 * sin omgivning — en import utanför mappen, en global CSS-regel, en bild som
 * inte ligger i public/kompass/ eller ett paket som inte står i package.json.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROT = resolve(__dirname, "../..");
const MODUL = join(ROT, "src/kompass");
const APP = join(ROT, "src/app");

function filer(mapp: string, filter: RegExp): string[] {
  return readdirSync(mapp).flatMap((namn) => {
    const vag = join(mapp, namn);
    if (statSync(vag).isDirectory()) return filer(vag, filter);
    return filter.test(namn) ? [vag] : [];
  });
}

const kod = filer(MODUL, /\.(ts|tsx)$/).filter((f) => !f.endsWith(".test.ts"));

/** Filens kod utan kommentarer — exempel i kommentarer ska inte räknas. */
const utanKommentarer = (fil: string) =>
  readFileSync(fil, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'])\/\/.*$/gm, "$1");

/** Import- och export-from-satser samt dynamiska importer. Inte .from(...). */
const importer = (fil: string) =>
  [
    ...utanKommentarer(fil).matchAll(
      /^\s*(?:import|export)\b[^;]*?\bfrom\s*["']([^"']+)["']|^\s*import\s*["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/gm,
    ),
  ].map((m) => m[1] ?? m[2] ?? m[3]);

describe("modulgränsen", () => {
  it("modulen importerar bara från sig själv och från paket", () => {
    const fel: string[] = [];
    for (const fil of kod) {
      for (const imp of importer(fil)) {
        if (imp.startsWith("@/") && !imp.startsWith("@/kompass")) {
          fel.push(`${relative(ROT, fil)} → ${imp}`);
        }
        if (imp.startsWith(".")) {
          const mal = resolve(join(fil, ".."), imp);
          if (!mal.startsWith(MODUL)) fel.push(`${relative(ROT, fil)} → ${imp}`);
        }
      }
    }
    expect(fel).toEqual([]);
  });

  // Sajten har egna sidor under src/app — bara importer av kompassen räknas.
  it("appen använder bara modulens tre ingångar", () => {
    const tillatna = ["@/kompass", "@/kompass/og", "@/kompass/server"];
    const fel: string[] = [];
    for (const fil of filer(APP, /\.(ts|tsx)$/)) {
      for (const imp of importer(fil)) {
        if (imp.startsWith("@/kompass") && !tillatna.includes(imp)) {
          fel.push(`${relative(ROT, fil)} → ${imp}`);
        }
      }
    }
    expect(fel).toEqual([]);
  });

  it("varje paket modulen använder står i package.json", () => {
    const pkg = JSON.parse(readFileSync(join(ROT, "package.json"), "utf8"));
    const finns = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }));
    const saknas = new Set<string>();
    for (const fil of kod) {
      for (const imp of importer(fil)) {
        if (imp.startsWith(".") || imp.startsWith("@/") || imp.startsWith("node:")) continue;
        const paket = imp.startsWith("@") ? imp.split("/").slice(0, 2).join("/") : imp.split("/")[0];
        if (!finns.has(paket)) saknas.add(paket);
      }
    }
    expect([...saknas]).toEqual([]);
  });

  it("bilderna modulen använder ligger i public/kompass/", () => {
    const saknas: string[] = [];
    for (const fil of kod) {
      for (const m of utanKommentarer(fil).matchAll(/tillgang\(["']([^"']+)["']\)/g)) {
        if (!existsSync(join(ROT, "public/kompass", m[1]))) saknas.push(m[1]);
      }
    }
    expect(saknas).toEqual([]);
  });
});

describe("CSS-isoleringen", () => {
  const css = readFileSync(join(MODUL, "kompass.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

  it("varje regel ligger under .kompass", () => {
    // Selektorer utanför @keyframes: allt före en { som inte är en procentsats,
    // from/to eller en @-regel.
    const utanKeyframes = css.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
    const selektorer = [...utanKeyframes.matchAll(/([^{}]+)\{/g)]
      .map((m) => m[1].trim())
      .filter((s) => s && !s.startsWith("@"));
    const globala = selektorer
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter((s) => !s.startsWith(".kompass"));
    expect(globala).toEqual([]);
  });

  it("alla animationer heter k-*", () => {
    const namn = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
    expect(namn.length).toBeGreaterThan(0);
    expect(namn.filter((n) => !n.startsWith("k-"))).toEqual([]);
  });

  it("varje k-klass i komponenterna finns i CSS:en, och tvärtom", () => {
    const iCss = new Set([...css.matchAll(/\.(k-[a-z-]+)/g)].map((m) => m[1]));
    const iKod = new Set(
      filer(join(MODUL, "komponenter"), /\.tsx$/).flatMap((f) =>
        [...readFileSync(f, "utf8").matchAll(/["'`\s](k-[a-z]+(?:-[a-z]+)*)(?=["'`\s])/g)].map(
          (m) => m[1],
        ),
      ),
    );
    expect([...iKod].filter((k) => !iCss.has(k))).toEqual([]);
    expect([...iCss].filter((k) => !iKod.has(k))).toEqual([]);
  });

  it("inga fasta px-mått i komponenterna — rem skalar med värdappen", () => {
    // khyte.se har html { font-size: 18px }. Med rem skalar allt lika; med px
    // blir text och ytor ojämnt stora. Undantag: honeypoten utanför skärmen.
    const px = filer(join(MODUL, "komponenter"), /\.tsx$/).flatMap((f) =>
      [...readFileSync(f, "utf8").matchAll(/-\[(-?\d+(?:\.\d+)?)px\]/g)]
        .filter((m) => m[1] !== "-9999")
        .map((m) => `${relative(ROT, f)}: ${m[0]}`),
    );
    expect(px).toEqual([]);
  });

  it("modulen använder bara sina egna CSS-variabler", () => {
    const utanfor = filer(MODUL, /\.(tsx|css)$/).flatMap((f) =>
      [...readFileSync(f, "utf8").matchAll(/var\(--(?!k-)([\w-]+)\)/g)].map(
        (m) => `${relative(ROT, f)}: --${m[1]}`,
      ),
    );
    expect(utanfor).toEqual([]);
  });
});
