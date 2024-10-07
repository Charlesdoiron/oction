/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page, Browser } from "puppeteer-core";
import prisma from "@/app/lib/prisma";
import { transformPrice } from "@/app/utils/parse";

// Define the structure of property details
interface PropertyDetails {
  id: string;
  auction_date: string;
  visit_date: string;
  type: string;
  description: string;
  adjudication_price: string;
  starting_price: string;
  location: string;
  url?: string;
  tribunal: string;
  lawyer: string;
}

const BASE_URL = "https://www.licitor.com";

const DELAY_BETWEEN_PAGES = 10; // 2 seconds delay between pages

export async function scrapePropertyDetails(
  browser: Browser,
  url: string,
  region: string
): Promise<{ results: string[]; duration: number; total: number }> {
  const startTime = Date.now();
  const results: string[] = [];
  let page: Page | null = null;

  try {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const totalPages = await getTotalPages(page);

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      await scrapePageLinks(
        totalPages,
        currentPage,
        page,
        `${url}?p=${currentPage}`,
        region,
        results
      );
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_PAGES));
    }
  } catch (error) {
    console.error("Error in scrapePropertyDetails:", error);
  } finally {
    if (page) await page.close();
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  return { results, duration, total: results.length };
}

async function scrapePageLinks(
  totalPages: number,
  currentPage: number,
  page: Page,
  url: string,
  region: string,
  results: string[]
): Promise<void> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const links = await getLinksFromPage(page);
    console.log(
      `Page ${currentPage}/${totalPages} - Found ${links.length} links`
    );

    for (let i = 0; i < links.length; i++) {
      const adjudicationUrl = links[i].startsWith("http")
        ? links[i]
        : `${BASE_URL}${links[i]}`;
      let propertyPage: Page | null = null;

      try {
        propertyPage = await page.browser().newPage();
        await propertyPage.goto(adjudicationUrl, {
          waitUntil: "domcontentloaded",
        });
        const propertyDetails = await scrapeDetail(propertyPage);

        if (propertyDetails) {
          await processPropertyDetails(
            propertyDetails,
            adjudicationUrl,
            region,
            results
          );
          console.log(
            `${i + 1}/${links.length} - Processed ${propertyDetails.id}`
          );
        }
      } catch (error) {
        console.error(`Error processing ${adjudicationUrl}:`, error);
      } finally {
        if (propertyPage) await propertyPage.close();
      }
    }
  } catch (error) {
    console.error(`Error scraping page ${url}:`, error);
  }
}

// Function to scrape details from a single property page
async function scrapeDetail(page: Page): Promise<PropertyDetails> {
  return await page.evaluate(() => {
    // Extract property details from the DOM
    const lawyerRaw =
      document.querySelector(".Trust")?.textContent?.trim() || "";
    const lawyer = lawyerRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(", ")
      .replace(/\s+/g, " ");
    const id = document.querySelector(".Number")?.textContent?.trim() || "";
    const tribunal =
      document
        .querySelector(".Court")
        ?.textContent?.split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(", ")
        .replace(/\s+/g, " ") || "";
    const auction_date =
      document.querySelector(".Date")?.textContent?.trim() || "";
    const type =
      document.querySelector(".FirstSousLot h2")?.textContent?.trim() || "";
    const description =
      document.querySelector(".FirstSousLot p")?.textContent?.trim() || "";
    const adjudication_price =
      document.querySelector(".Lot h4")?.textContent?.trim() || "";
    const starting_price =
      document.querySelector(".Lot h3")?.textContent?.trim() || "";
    const location =
      (document.querySelector(".Location .Map a") as HTMLAnchorElement)?.href ||
      "";
    const visit_date =
      document
        .querySelector(".Visits")
        ?.textContent?.trim()
        .replace("Visite sur place ", "") || "";

    return {
      auction_date,
      type,
      description,
      adjudication_price,
      starting_price,
      location,
      tribunal,
      id,
      lawyer,
      visit_date,
    };
  });
}

// New helper functions
async function getTotalPages(page: Page): Promise<number> {
  return page.evaluate(() => {
    return parseInt(
      document
        .querySelector(".PageTotal")
        ?.textContent?.replace(/[^0-9]/g, "") || "0"
    );
  });
}

async function getLinksFromPage(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".AdResults li a")).map(
      (a) => (a as HTMLAnchorElement).href
    )
  );
}

async function processPropertyDetails(
  propertyDetails: PropertyDetails,
  adjudicationUrl: string,
  region: string,
  results: string[]
): Promise<void> {
  const existingAd = await prisma.ad.findUnique({
    where: {
      id: propertyDetails.id,
      adjudication_price: {
        not: null,
      },
    },
  });

  if (!existingAd) {
    await prisma.ad.create({
      data: {
        ...propertyDetails,
        starting_price: transformPrice(propertyDetails.starting_price),
        adjudication_price: transformPrice(propertyDetails.adjudication_price),
        url: adjudicationUrl,
        region,
        auction_date: propertyDetails.auction_date,
        visit_date: propertyDetails.visit_date,
      },
    });
    results.push(propertyDetails.id);
  } else {
    console.group(`Duplicate found: ${propertyDetails.id}`);
    console.dir(propertyDetails, { depth: null });
    console.dir(existingAd, { depth: null });
    console.groupEnd();
  }
}

// let currentIdx = 1;

// // Go to the  page
// // Wait for the page to load
// await page.waitForSelector(".FirstSousLot");
// Get the links
// Click on each link
// Scrape the details

// increment currentIdx
// repeat
