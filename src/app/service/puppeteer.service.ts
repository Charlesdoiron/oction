/* eslint-disable @typescript-eslint/no-namespace */
import puppeteer from "puppeteer";

async function puppeteerProd() {
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: `wss://chrome.browserless.io?token=a09db5f0-5d43-4a94-971c-370fc0b71877`,
  // });

  const browser = await puppeteer.launch({
    headless: true,
  });

  console.log("✅ Connected to browserless");
  return browser;
}

export namespace PuppeteerService {
  export async function getBrowser() {
    return puppeteerProd();
  }
}
