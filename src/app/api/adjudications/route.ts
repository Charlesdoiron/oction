import { Browser } from "puppeteer-core";

// import { PuppeteerService } from "@/app/service/puppeteer.service";
import {
  localExecutablePath,
  isDev,
  remoteExecutablePath,
} from "@/app/utils/utils";
const chromium = require("@sparticuz/chromium-min");

// Importing Puppeteer core as default otherwise
// it won't function correctly with "launch()"
import puppeteer from "puppeteer-core";

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.

import { NextResponse } from "next/server";
import { scrapePropertyDetails } from "./utils/property";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds (update by 2024-05-10)
export const dynamic = "force-dynamic";

export async function GET() {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--enable-automation"],
    args: isDev
      ? [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
          "--disable-features=site-per-process",
          "-disable-site-isolation-trials",
        ]
      : [...chromium.args, "--disable-blink-features=AutomationControlled"],
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: isDev
      ? localExecutablePath
      : await chromium.executablePath(remoteExecutablePath),
    headless: true,
    timeout: 60000, // Increase timeout to 60 seconds
  });
  const metaRegions = [
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/outre-mer/historique-des-adjudications.html",
      region: "outre-mer",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/outre-mer/prochaines-ventes.html",
      region: "outre-mer",
    },

    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/centre-loire-limousin/historique-des-adjudications.html",
      region: "centre-loire-limousin",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/centre-loire-limousin/prochaines-ventes.html",
      region: "centre-loire-limousin",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/bretagne-grand-ouest/historique-des-adjudications.html",
      region: "bretagne-grand-ouest",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/bretagne-grand-ouest/prochaines-ventes.html",
      region: "bretagne-grand-ouest",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/regions-du-nord-est/historique-des-adjudications.html",
      region: "regions-du-nord-est",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/regions-du-nord-est/prochaines-ventes.html",
      region: "regions-du-nord-est",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-ouest-pyrenees/historique-des-adjudications.html",
      region: "sud-ouest-pyrenees",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-ouest-pyrenees/prochaines-ventes.html",
      region: "sud-ouest-pyrenees",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-est-mediterrannee/historique-des-adjudications.html",
      region: "sud-est-mediterrannee",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-est-mediterrannee/prochaines-ventes.html",
      region: "sud-est-mediterrannee",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/paris-et-ile-de-france/historique-des-adjudications.html",
      region: "ile-de-france",
    },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/paris-et-ile-de-france/prochaines-ventes.html",
      region: "ile-de-france",
    },
  ];

  try {
    const details = await Promise.all(
      metaRegions.map(async (metaRegion) => {
        const region = metaRegion.region;
        const { results, duration, total } = await scrapePropertyDetails(
          browser as Browser,
          metaRegion.url,
          region
        );
        return { region, details: results, duration, total };
      })
    );

    return NextResponse.json({
      ok: true,
      metaRegions: metaRegions.length,
      results: details,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to scrape data", message: error },
      { status: 500 }
    );
  } finally {
    // await browser.close();
  }
}
