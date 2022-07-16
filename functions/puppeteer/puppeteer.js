const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.EXCECUTABLE_PATH || await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto(event.url || 'https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz');

    result = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    statusCode: 200,
    body: result
  }
};