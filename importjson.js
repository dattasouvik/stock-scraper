const path = require('path');
const scrapperController = require('./controller/scrapperController');

(async() =>{
    let sourceFile = path.join(`${__dirname}`, 'data', 'stocks.xlsx');
    let ouputJsonFile = path.join(`${__dirname}`, 'data', 'stocks.json');
    await scrapperController.generateStocksListJSON(sourceFile,'Stocks',ouputJsonFile)
    .then(status => console.log(`File Generation ${status}`))
    .catch(err => {
        console.log("Something went wrong", err);
    });
})();