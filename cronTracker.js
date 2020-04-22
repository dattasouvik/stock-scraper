const cron = require('cron');
const path = require('path');
const moment = require('moment');
const scrapperController = require('./controller/scrapperController');


/* MAin Cron To prepare master json (Runs Every Day) */
/* NOT USED */

module.exports.jsonCron = cron.job('0 0 * * *', async () => { 
    console.log("Message every day 🥱 " + new Date());
    let sourceFile = path.join(`${__dirname}`, 'data', 'stocks.xlsx');
    let ouputJsonFile = path.join(`${__dirname}`, 'data', 'stocks.json');
    await scrapperController.generateStocksListJSON(sourceFile,'Stocks',ouputJsonFile)
    .then(status => console.log(`File Generation ${status}`))
    .catch(err => {
        console.log("Error", err);
    });
});


/* Cron Set For Tracking Stocks  */

module.exports.stockMonitorCron = cron.job('*/15 * * * *', async () => {
    console.log(`Cron At every 15th minute - ${moment().format("dddd,Do MMMM YYYY, h:mm:ss a")}`);
    let stockListJsonFile = path.join(`${__dirname}`, 'data', 'stocks.json');
    let mailTrackerFile = path.join(`${__dirname}`,'data','stockMailTracker.json');
    /* Read Stocks List From JSON file */
    await scrapperController.monitorStocks(stockListJsonFile,mailTrackerFile)
    .then(() => {
        /* Notify IF Stock reaches target */
        return scrapperController.notifyMail(mailTrackerFile)
    })
    .then(()=>{
        /* UPDATE JSON file with stocks yet to reach target */
        return scrapperController.trackStocksListJSON(stockListJsonFile,mailTrackerFile);
    })
    .catch(err => {
        console.log("Error", err);
    });
});
