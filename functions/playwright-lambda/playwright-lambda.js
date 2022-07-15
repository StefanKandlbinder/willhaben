const { chromium } = require("playwright-core");
const awsChromium = require("chrome-aws-lambda");

exports.handler = async (event, context) => {
  // const params = JSON.parse(event.body);
  const pageToScrape =
    "https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz";

  let result = null;
  let browser = null;

  console.log(await awsChromium.executablePath)

  try {
    const browser = await chromium.launch({
      headless: false,
      executablePath: await awsChromium.executablePath,
    });
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(pageToScrape);
    const result = await page.content();
    console.log(result);
  } catch (error) {
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
