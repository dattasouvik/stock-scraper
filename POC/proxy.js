const puppeteer = require('puppeteer');
const proxyController = require('../controller/proxyController');
const cron = require('cron');

const job = cron.job('* * * * *', async () => {
  console.log("Message every minute 🥱 "+ new Date());
  console.log(proxyController.randProxy());
  (async () => {
    /* Initiate the Puppeteer browser */
    const browser = await puppeteer.launch({
      headless: false,   
      // slowMo: 250, // 250ms slow down
      args: [ `--proxy-server=http://${proxyController.randProxy()}` ]
    });
    const page = await browser.newPage();
    /* Go to the IMDB Movie page and wait for it to load */
    await page.goto('https://www.moneycontrol.com/');
    /* Outputting what we scraped */
    await browser.close();
  })();
});
job.start();