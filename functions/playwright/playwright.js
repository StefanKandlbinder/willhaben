const { chromium } = require("playwright");

exports.handler = async (event, context) => {
  let theTitle = null;
  let browser = null;
  console.log("spawning chrome headless");
  console.log(await chromium.executablePath());
  console.log(process.env);

  try {
    browser = await chromium.launch({
      headless: true, // Show the browser.
      executablePath: '/opt/buildhome/.cache/ms-playwright/chromium-1012',
    });
    console.log(chromium.executablePath());
    const page = await browser.newPage();
    await page.goto(
      "https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz"
    );
    theTitle = await page.locator("#result-list-title").allInnerTexts();
    theTitle = await theTitle[0].split(" ")[0];
    // console.log(theTitle.innerText);
    /* const books = await page.$$eval(".product_pod", (all_items) => {
      const data = [];
      all_items.forEach((book) => {
        const name = book.querySelector("h3").innerText;
        const price = book.querySelector(".price_color").innerText;
        const stock = book.querySelector(".availability").innerText;
        data.push({ name, price, stock });
      });
      return data;
    });
    console.log(books); */
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    };
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: theTitle,
    }),
  };
};
