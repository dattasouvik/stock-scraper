const puppeteer = require('puppeteer');
const catchAsync = require('./../utils/catchAsync');

const titleSelector = 'section #sec_quotes div > h1.pcstname';
const contentSelector = 'div#div_nse_livebox_wrap div.nsbs_bg .div_live_price_wrap > span';
const nsePriceSelector = 'div#div_nse_livebox_wrap div.nsbs_bg .div_live_price_wrap > span.stprh';
const nseChangeSelector = 'div#div_nse_livebox_wrap div.nsbs_bg .div_live_price_wrap > span.span_price_change_prcnt > em';
const nseLastUpdatedSelector = 'div#div_nse_livebox_wrap div.nsbs_bg span.display_lastupd';
const nsetodaysLowSelector = 'div#div_nse_livebox_wrap div.mkt_openclosebx .open_lhs1 .todays_lowhigh_wrap > .low_high1';
const nsetodaysHighSelector = 'div#div_nse_livebox_wrap div.mkt_openclosebx .open_lhs1 .todays_lowhigh_wrap > .low_high3';

module.exports.run = catchAsync(async (stocksListArray) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);
    const stocksList = [...stocksListArray];
    let results = [];
    // Visit each page one by one
    for (let stock of stocksList) {
        const {id,url,target} = stock
        // open the page
        await page.goto(url,{
            waitUntil: "networkidle2",
            // Remove the timeout
            timeout: 0
          });
        console.log('Opened: Id '+id, url);
        let pagePathname = await page.evaluate(() => { location.pathname });
        // get the title of the post
        await page.waitForSelector(titleSelector, { timeout: 0 });
        const pageTitle = await page.$eval(titleSelector, titleSelector => titleSelector.innerText);
        // get the content of the page
        await page.waitForSelector(contentSelector, { timeout: 0 });
        const nse_price = await page.$eval(nsePriceSelector, nsePriceSelector => nsePriceSelector.innerText);
        const matched = checkTargetMatch(target,nse_price);
        const nse_change = await page.$eval(nseChangeSelector, nseChangeSelector => nseChangeSelector.innerText);
        const nse_todaysLow = await page.$eval(nsetodaysLowSelector, nsetodaysLowSelector => nsetodaysLowSelector.innerText);
        const nse_todaysHigh = await page.$eval(nsetodaysHighSelector, nsetodaysHighSelector => nsetodaysHighSelector.innerText);
        const nse_last_updated = await page.$eval(nseLastUpdatedSelector, nseLastUpdatedSelector => nseLastUpdatedSelector.innerText);
        results.push({
            id,
            url,
            stock: pageTitle,
            price: nse_price,
            todaysLow: nse_todaysLow,
            todaysHigh: nse_todaysHigh,
            change: nse_change,
            capturedOn: nse_last_updated,
            target,
            matched,
            time: Date.now()
        });
    }
    // all done, close the browser
    await browser.close();
    return results;
});

function checkTargetMatch(targetPrice,livePrice){
    return (livePrice >= targetPrice ? 1: 0); 
}