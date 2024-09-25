import { Page } from "puppeteer";

export interface Juridiction {
  title: string;
  href: string;
}

const URL = "https://www.licitor.com/historique-des-adjudications.html";

export async function scrapeJuridictions(page: Page): Promise<Juridiction[]> {
  console.log("Scraping juridictions");
  await page.goto(URL, { waitUntil: "networkidle0" });
  console.log("Waiting for selector");
  await Promise.all([page.waitForSelector("#courts")]);
  console.log("Evaluating");
  const juridictions = await page.evaluate(() => {
    const list = Array.from(
      document.querySelectorAll("#courts ul li ul li a")
    ).map((a) => ({
      title: a.textContent?.trim().replace(/\s+/g, " ") || "",
      href: (a as HTMLAnchorElement).href,
    }));
    console.log(list);
    return list;
  });

  return juridictions;
}
