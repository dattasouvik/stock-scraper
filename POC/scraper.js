const puppeteer = require('puppeteer');

module.exports.run = (url)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            let data = await page.evaluate(() => {
                let results = [];
                let name = document.querySelector('section #sec_quotes div > h1.pcstname').innerText;
                let nse_price = document.querySelector('div#div_nse_livebox_wrap div.nsbs_bg .div_live_price_wrap > span.stprh ').innerText;
                let nse_last_updated = document.querySelector('div#div_nse_livebox_wrap div.nsbs_bg span.display_lastupd').innerText;
                let nse_change = document.querySelector('div#div_nse_livebox_wrap div.nsbs_bg .div_live_price_wrap > span.span_price_change_prcnt > em').innerText;
                results.push({
                    stock:name,
                    price:nse_price,
                    change:nse_change,
                    capturedOn: nse_last_updated,
                    time: Date.now()
                })
                return results;
            });
            browser.close();
            return resolve(data);
        } catch (e) {
            return reject(e);
        }
    })
}