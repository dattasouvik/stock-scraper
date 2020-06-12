const path = require('path')
const excelHandler = require('./../utils/excelHandler');
const puppeteerHandler = require('./puppeteerController');
const csvHandler = require('../utils/csvHandler');
const fileHandler = require('./../utils/fileHandler');
const sendEmail = require('./../utils/email');
const catchAsync = require('./../utils/catchAsync');
const helperMethods = require('./../utils/helperMethods');


const mailHandler = catchAsync((stockEl)=>{
	const { id,stock,price,capturedOn,target,todaysLow,todaysHigh } = stockEl;
	console.log(`Mail triggered for ${stock} Id-${id} 😎`);
	const message = `
	<p>
		Stock: ${stock} has reached target price of Rs.${target} 
		<b>(Data captured on ${capturedOn})</b>.
  	</p>
	<table  border="10"
			style="background-color: aqua; border-color: red blue gold teal;">
		<thead>
			<th>Name</th>
			<th>Current Price</th>
			<th>Target Price</th>
			<th>Today's High</th>
			<th>Today's Low</th>
		</thead>
		<tbody>
			<tr>
				<td>${stock}</td>
				<td>Rs.${price}</td>
				<td>Rs.${target}</td>
				<td>${todaysHigh}</td>
				<td>${todaysLow}</td>
			</tr>
		</tbody>
	</table>`;
	return sendEmail({
		email: process.env.RECIPIENT_EMAIL,
		subject: `${stock} has reached the target Rs.${target} 😁`,
		message
	});
});

module.exports.monitorStocks = (stockListJsonFile,mailTrackerFile ) =>{
	return new Promise((resolve,reject) =>{
		fileHandler.readFilePro(stockListJsonFile)
		.then(dataArray => {
			return JSON.parse(dataArray);
		})
		.then((elArray) =>{
			return puppeteerHandler.run(elArray);
		})
		.then(dataArray => {
			/*TODO Prepare a cpoy of Data for MAil Functionaliy */
			fileHandler.writeFilePro(mailTrackerFile,JSON.stringify(dataArray));
			return csvHandler.prepareExcelData(dataArray);
		})
		.then((excelData) => {
			let filepath = path.join(`${__dirname}`,'..','data','stockTracker.xls');
			const appendedData = fileHandler.appendFilePro(filepath, excelData);
			resolve(appendedData);
		})
		.catch((err) => {
			// console.log("Error", err);
			reject("Error in Stock Monitoring");
		}); 
	});
}



module.exports.notifyMail = (filename) => {
	return new Promise((resolve,reject) =>{
		fileHandler.readFilePro(filename)
		.then(stockArray => {	
			if(stockArray.length >= 1){
				stockArray = JSON.parse(stockArray);
				const filteredStocks =  stockArray.filter(stock => {
					return stock.matched !== 0
				});
				if(filteredStocks.length === 0){
					reject('No Matching Stocks Available to process further 😈');
				}
				return filteredStocks;
			}else {
				reject('No Data available 😈');	
			}
		})
		.then(filteredStocks => {
			if(filteredStocks.length >= 1){
				const filteredStocksArray =  filteredStocks.map((stockEl) => {
					mailHandler(stockEl);
				})
				resolve(filteredStocksArray);
			}else {
				reject("No Mail Triggered 😈");	
			}
		})
		.catch(err => {
			// console.log("Error", err);
			reject("Error in Email Notifiacation 😈");
		});
	});
}

module.exports.generateStocksListJSON = (filename,worksheet,outputfilename, keyIdentifiers = ['id','url','target'] ) => {
	return new Promise((resolve,reject) =>{
		excelHandler.readExcel(filename)
		.then(workbook => {
			return excelHandler.validateWorksheet(workbook, worksheet)
		})
		.then(worksheet => {
			return excelHandler.filterExcelRows(worksheet)
		})
		.then(dataArray => {
			return helperMethods.convertNestedArraysToObjects(dataArray,[...keyIdentifiers]);
		})
		.then(dataArray => {
			const jsonData = fileHandler.writeFilePro(outputfilename,JSON.stringify(dataArray));
			return resolve(jsonData);
		})
		.catch(() => {
			reject("Error in Generating JSON File 😡");
		}); 
	});
}


module.exports.trackStocksListJSON = (stockListFile, mailTrackerFile) =>{
	return new Promise((resolve,reject) =>{
		if(stockListFile === null || mailTrackerFile === null){
			reject("Error in Input");
		}
		let files = [stockListFile, mailTrackerFile];
		fileHandler.readMutiplesFilePro(files)
		.then(mergeddataArray => {
			let formattedArray = [];
			mergeddataArray.map(el =>formattedArray.push(JSON.parse(el)));
			return formattedArray;
		})
		.then( formattedArray => {
			let [stocksList, mailtracker] = formattedArray;
			const filteredStocks =  mailtracker.filter(stock => {
				return stock.matched === 0
			});
			const getKeys = helperMethods.extractKeys(stocksList);
			const unMatchedStocks = helperMethods.extractProperties(filteredStocks,getKeys);
			return unMatchedStocks;
		})
		.then(dataArray => {
			const jsonUpdated =fileHandler.writeFilePro(stockListFile,JSON.stringify(dataArray));
			return resolve(jsonUpdated);
		})
		.catch(err => {
			// console.log("Error", err);
			reject("Error in Updating Data 😈");
		});
	});
}
