import { PuppeteerService } from "@/app/service/puppeteer.service";
import { NextResponse } from "next/server";
import { scrapePropertyDetails } from "./utils/property";

export async function GET() {
  const browser = await PuppeteerService.getBrowser();

  const metaRegions = [
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/outre-mer/historique-des-adjudications.html",
    //   region: "outre-mer",
    //   totalPages: 4,
    // },
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/centre-loire-limousin/historique-des-adjudications.html",
    //   region: "centre-loire-limousin",
    //   totalPages: 35,
    // },
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/bretagne-grand-ouest/historique-des-adjudications.html",
    //   region: "bretagne-grand-ouest",
    //   totalPages: 131,
    // },
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/regions-du-nord-est/historique-des-adjudications.html",
    //   region: "regions-du-nord-est",
    //   totalPages: 246,
    // },
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-ouest-pyrenees/historique-des-adjudications.html",
    //   region: "sud-ouest-pyrenees",
    //   totalPages: 323,
    // },
    // {
    //   url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/sud-est-mediterrannee/historique-des-adjudications.html",
    //   region: "sud-est-mediterrannee",
    //   totalPages: 2030,
    // },
    {
      url: "https://www.licitor.com/ventes-aux-encheres-immobilieres/paris-et-ile-de-france/historique-des-adjudications.html",
      region: "paris-et-ile-de-france",
      totalPages: 3124,
    },
  ];

  try {
    const details = await Promise.all(
      metaRegions.map(async (metaRegion) => {
        const region = metaRegion.region;
        const { results, duration, total } = await scrapePropertyDetails(
          browser,
          metaRegion.url,
          region,
          metaRegion.totalPages
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
    await browser.close();
  }
}
