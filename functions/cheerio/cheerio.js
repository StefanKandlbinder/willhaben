const request = require('axios')
const cheerio = require('cheerio')

exports.handler = async (event, context) => {
  const url = 'https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz'
  try {
    const { data } = await request(url)
    const $ = cheerio.load(data)
    /* queryDOM */
    const resultTitle = $('##result-list-title')
    console.log('result title', resultTitle)
    /* const itemsText = items.map((i, el) => {
      return $(el).text().trim()
    })
    console.log('itemsText', items)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: itemsText,
      })
    } */
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error
      })
    }
  }
}