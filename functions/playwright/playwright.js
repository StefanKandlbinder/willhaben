const { chromium } = require("playwright");

exports.handler = async (event, context) => {
  let theTitle = null;
  let browser = null;
  console.log("spawning chrome headless");

  try {
    browser = await chromium.launch({
        headless: true // Show the browser. 
    });
    const page = await browser.newPage();
    await page.goto("https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz");
    theTitle = await page.locator("#result-list-title").allInnerTexts()
    theTitle = await theTitle[0].split(' ')[0];
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
