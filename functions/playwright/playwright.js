const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require ("firebase/database");
const { chromium } = require("playwright");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const endpoints = [
  {
    title: "Mietwohnungen",
    url: "https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz",
  },
  {
    title: "Eigentumswohnungenwohnungen",
    url: "https://www.willhaben.at/iad/immobilien/eigentumswohnung/oberoesterreich/linz",
  },
  {
    title: "OÖ Wohnbau",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37441909&verticalId=2",
  },
  {
    title: "WSG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=29720423&verticalId=2",
  },
  {
    title: "GWG Linz",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=28446133&verticalId=2",
  },
  {
    title: "Lawog",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=17103067&verticalId=2",
  },
  {
    title: "EBS",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=7091459&verticalId=2",
  },
  {
    title: "GIWOG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912138&verticalId=2",
  },
  {
    title: "Wohnbau 200",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912076&verticalId=2",
  },
  {
    title: "Neue Heimat",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563419&verticalId=2",
  },
  {
    title: "Familie",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37609411&verticalId=2",
  },
  {
    title: "Lebensräume",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563410&verticalId=2",
  },
  {
    title: "BRW",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556903&verticalId=2",
  },
  {
    title: "WAG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556872&verticalId=2",
  },
];

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

function writeResults(result) {
  const date = new Date(Date.now())
  const db = getDatabase();
  set(ref(db, `${date.getMonth()}/${date.getDay()}/`), result);
}

/* writeResults(
  {
    'WSG': '48',
    'OÖ Wohnbau': '51'
  }
) */

exports.handler = async (event, context) => {
  let results = {};
  let browser = null;
  console.log("spawning chrome headless");
  console.log(await chromium.executablePath());

  try {
    console.log(chromium.executablePath());
    const executablePath = await chromium.executablePath()
    browser = await chromium.launch({
      headless: true, // Hide the browser.
      executablePath: executablePath,
    });

    Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const page = await browser.newPage();
        await page.goto(endpoint.url);

        theTitle = await page.locator("#result-list-title").allInnerTexts();
        theTitle = await theTitle[0].split(" ")[0];

        results[endpoint.title] = theTitle
      })
    ).then(async () => {
      writeResults(results);
      console.log(JSON.stringify(results));

      if (browser !== null) {
        await browser.close();
      }
    });
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
    /* if (browser !== null) {
      await browser.close();
    } */
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      results,
    }),
  };
};
