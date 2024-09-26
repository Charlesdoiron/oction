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

  const page = await browser.newPage();
  // get the total number of pages
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const totalPages = await page.evaluate(() => {
    return parseInt(
      document
        .querySelector(".PageTotal")
        ?.textContent?.replace(/[^0-9]/g, "") || "0"
    );
  });

  try {
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      await scrapePageLinks(
        totalPages,
        currentPage,
        page,
        `${url}?p=${currentPage}`,
        region,
        results
      );
      // Add a delay between pages to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_PAGES));
    }
  } finally {
    await page.close();
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

    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".AdResults li a")).map(
        (a) => (a as HTMLAnchorElement).href
      )
    );
    // log here the current Page + the number of links found and the number of links how allready exists in the database, and the number of links that will be scraped
    console.log(`Page ${currentPage}/${totalPages}`);

    let currentIdx = 1;
    for (const href of links) {
      const adjudicationUrl = href.startsWith("http")
        ? href
        : `${BASE_URL}${href}`;
      const propertyPage = await page.browser().newPage();
      try {
        await propertyPage.goto(adjudicationUrl, {
          waitUntil: "domcontentloaded",
        });
        const propertyDetails = await scrapeDetail(propertyPage);
        if (propertyDetails) {
          const existingAd = await prisma.ad.findUnique({
            where: { id: propertyDetails.id },
          });

          if (!existingAd) {
            await prisma.ad.create({
              data: {
                ...propertyDetails,
                starting_price: transformPrice(propertyDetails.starting_price),
                adjudication_price: transformPrice(
                  propertyDetails.adjudication_price
                ),
                url: adjudicationUrl,
                region,
                auction_date: propertyDetails.auction_date,
                visit_date: propertyDetails.visit_date,
              },
            });
            results.push(propertyDetails.id);
            console.log(
              `${currentIdx}/${links.length} - Add ${propertyDetails.id} in database`
            );
            currentIdx++;
          } else {
            console.group(`Duplicate found: ${propertyDetails.id}`);
            console.dir(propertyDetails, { depth: null });
            console.dir(existingAd, { depth: null });
            console.groupEnd();
          }
        }
      } finally {
        await propertyPage.close();
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

// let currentIdx = 1;

// // Go to the  page
// // Wait for the page to load
// await page.waitForSelector(".FirstSousLot");
// Get the links
// Click on each link
// Scrape the details

// increment currentIdx
// repeat
