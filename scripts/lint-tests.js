#!/usr/bin/env node
/**
 * lint-tests.js — Linter de antipatrones VTEX para tests/.
 *
 * Portado el 08/09/2026 desde qa-automation-api/playwright-tests/scripts/lint-tests.js
 * (repo de equipo, otra suite) porque las 4 reglas son restricciones de VTEX IO,
 * no de esa feature puntual. Se recorta la narrativa de incidentes de ese repo:
 * las reglas y su justificacion tecnica quedan documentadas en CONVENCIONES.md.
 *
 * Uso: node scripts/lint-tests.js
 *      node scripts/lint-tests.js --warn-only   (sale 0 aunque haya violaciones)
 *      npm run lint:tests
 *      npm run verify           (typecheck + lint)
 */

"use strict";

const fs = require("fs");
const path = require("path");

const TESTS_DIR = path.join(__dirname, "..", "tests");
const SPECS_DIR = path.join(TESTS_DIR, "specs");

const WARN_ONLY = process.argv.includes("--warn-only");

function isCommentLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("*");
}

function hasSuppression(lines, index, ruleId) {
  const suppressPattern = new RegExp(
    "\\/\\/\\s*lint-disable:\\s*" + ruleId + "\\b"
  );

  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i];
    if (!isCommentLine(line)) return false;
    if (suppressPattern.test(line)) return true;
  }
  return false;
}

const RULES = [
  {
    id: "RULE-1",
    name: "Clase CSS versionada de VTEX",
    // {app-con-o-sin-guiones}-{version}-x-{handle} se rompe en cada deploy
    // mayor de la app, sin ninguna pista del deploy que lo causo.
    pattern: /[\w-]+?-\d+-x-/,
    scope: TESTS_DIR,
    excludeComments: true,
    message:
      'Clase CSS versionada de VTEX. Usar [class*="handle"] en su lugar (sin el numero de version).',
  },
  {
    id: "RULE-2",
    name: "Espera por networkidle",
    // VTEX mantiene trafico HTTP continuo (analytics, chat, inventario):
    // waitForLoadState('networkidle') no resuelve nunca.
    pattern: /waitForLoadState\(['"`]networkidle/,
    scope: TESTS_DIR,
    excludeComments: true,
    message:
      "waitForLoadState('networkidle') no resuelve en VTEX: el trafico HTTP nunca cesa. Usar domcontentloaded + waitFor sobre un elemento concreto.",
  },
  {
    id: "RULE-3",
    name: "waitForTimeout",
    // Espera por tiempo fijo: inestable por definicion. Se acepta solo como
    // workaround documentado, y vive en el POM, nunca en el spec.
    pattern: /waitForTimeout\(/,
    scope: TESTS_DIR,
    excludeComments: true,
    message:
      "waitForTimeout encontrado. Reemplazar por una espera dirigida a un elemento o estado observable.\n  → Si VTEX no expone senal alguna, documentar el workaround con\n    // lint-disable: RULE-3 — <motivo> en el comentario que precede a la linea.",
  },
  {
    id: "RULE-4",
    name: "Locator inline en un spec",
    // Los selectores viven en el Page Object; un locator inline en el spec
    // saltea esa capa.
    pattern: /page\.locator\(/,
    scope: SPECS_DIR,
    fileFilter: (filePath) => filePath.endsWith(".spec.ts"),
    excludeLinePattern: /page\.locator\(["']body["']\)/,
    excludeComments: true,
    message:
      "page.locator() dentro de un spec. Mover el selector al Page Object correspondiente.",
  },
];

function collectTsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

function scanFile(filePath, rule) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (rule.excludeComments && isCommentLine(line)) continue;
    if (!rule.pattern.test(line)) continue;
    if (rule.excludeLinePattern && rule.excludeLinePattern.test(line)) continue;
    if (hasSuppression(lines, i, rule.id)) continue;

    violations.push({ line: i + 1, text: line.trim() });
  }

  return violations;
}

function main() {
  let totalViolations = 0;
  const violationsByFile = new Map();

  for (const rule of RULES) {
    let files = collectTsFiles(rule.scope);
    if (rule.fileFilter) {
      files = files.filter(rule.fileFilter);
    }

    for (const filePath of files) {
      const violations = scanFile(filePath, rule);
      if (violations.length === 0) continue;

      const relativePath = path
        .relative(process.cwd(), filePath)
        .replace(/\\/g, "/");

      for (const v of violations) {
        if (!violationsByFile.has(relativePath)) {
          violationsByFile.set(relativePath, []);
        }
        violationsByFile.get(relativePath).push({
          ruleId: rule.id,
          ruleName: rule.name,
          line: v.line,
          message: rule.message,
        });
        totalViolations++;
      }
    }
  }

  if (totalViolations === 0) {
    console.log("OK: sin violaciones.");
    process.exit(0);
  }

  console.log("");
  const fileCount = violationsByFile.size;

  for (const [filePath, entries] of violationsByFile) {
    for (const entry of entries) {
      console.log(`[${entry.ruleId}] ${filePath}:${entry.line}`);
      console.log(`  → ${entry.message}`);
      console.log("");
    }
  }

  const resumen = `${totalViolations} violacion(es) en ${fileCount} archivo(s).`;

  if (WARN_ONLY) {
    console.log(`${resumen} [modo warn-only — sale 0]`);
    process.exit(0);
  }

  console.log(resumen);
  process.exit(1);
}

main();
