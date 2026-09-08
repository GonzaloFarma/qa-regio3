#!/usr/bin/env node
/**
 * save-workspace-auth.js — captura manual de sesion contra un workspace VTEX
 * de tipo development (farma5049), que exige login + 2FA de VTEX Admin.
 *
 * Adaptado el 08/09/2026 de dos scripts hermanos (no de qa-automation-api,
 * que no los tiene): clone-bit/placa-previa/e2e/scripts/save-workspace-auth.js
 * y clone-bit/automation-playwright/tools/vtex-workspace-auth.js. Se dejo
 * afuera a proposito el intento de autocompletar email/password de la segunda
 * fuente: farma5049 confirmado (usuario, 08/09/2026) como development con 2FA,
 * y ese intento nunca pasa la pantalla de Authenticator - es codigo muerto en
 * este caso, no una alternativa real al login manual.
 *
 * No resuelve CI desatendido: sigue haciendo falta una persona completando el
 * login+2FA una vez por sesion. Ver docs/plans/autenticacion-workspaces-staging.md
 * en qa-automation-api para el estado de la alternativa (workspace production
 * dedicado a QA), que a esa fecha seguia sin resolver.
 *
 * Uso:
 *   npm run auth:save
 *   QA_BASE_URL=https://otro-workspace--farmacityar.myvtex.com npm run auth:save
 */

"use strict";

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { chromium } = require("@playwright/test");

const DEFAULT_BASE_URL = "https://farma5049--farmacityar.myvtex.com";
const DEFAULT_STATE_PATH = ".auth/farma5049.json";
const ADMIN_LOGIN_PATH = "/_v/segment/admin-login/";

const baseUrl = process.env.QA_BASE_URL || DEFAULT_BASE_URL;
const configuredStatePath = process.env.QA_STORAGE_STATE || DEFAULT_STATE_PATH;
const statePath = path.isAbsolute(configuredStatePath)
  ? configuredStatePath
  : path.resolve(__dirname, "..", configuredStatePath);

async function main() {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    locale: "es-AR",
    timezoneId: "America/Argentina/Buenos_Aires",
  });
  const page = await context.newPage();
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log(`[auth:workspace] Abriendo ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    await terminal.question(
      "Completa el login y el 2FA (Google Authenticator) en el navegador. " +
        "Cuando veas el Site Editor o el storefront, presiona Enter... ",
    );

    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    if (page.url().includes(ADMIN_LOGIN_PATH)) {
      throw new Error(
        "La sesion sigue en la pantalla de login de VTEX Admin - no se guardo nada.",
      );
    }

    await context.storageState({ path: statePath });
    console.log(`[auth:workspace] Sesion guardada en ${statePath}`);
    console.log(
      "[auth:workspace] Recorda: este archivo nunca se commitea (ver .gitignore) " +
        "y expira como cualquier sesion de VTEX Admin - repetir cuando vuelva a pedir login.",
    );
  } finally {
    terminal.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`[auth:workspace] ${error.message}`);
  process.exitCode = 1;
});
