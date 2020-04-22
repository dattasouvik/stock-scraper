const Excel = require('exceljs');

module.exports.generateExcel = (worksheetName, dataObj) => {
    return new Promise((resolve, reject) => {
        if (!dataObj) {
            reject('No Data Added:🤔');
        }
        // Create workbook & add worksheet
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(worksheetName);
        // add column headers
        worksheet.columns = [
            { header: 'Package', key: 'package_name' }, 
            { header: 'Author', key: 'author_name' }
        ];
        worksheet.addRows(dataObj);
        resolve(workbook);
    });
};

module.exports.readExcel = (filename) => {
    return new Promise((resolve, reject) => {
        if (!filename) {
            reject('No Directory Specified:🤔');
        }
        const workbook = new Excel.Workbook();
        resolve(workbook.xlsx.readFile(filename));
    });
};

module.exports.validateWorksheet = (workbook, worksheet) => {
    return new Promise((resolve, reject) => {
        if (!workbook) {
            reject('No Workbook Specified:🤔');
        }
        if (!worksheet) {
            reject('No Worksheet Specified:🤔');
        }
        const worksheetData = workbook.getWorksheet(worksheet);
        if (worksheetData) {
            resolve(worksheetData);
        }
        else {
            resolve("No such Worksheet Exists 😱");
        }
    });
};

module.exports.filterExcelRows = (worksheet) => {
    return new Promise((resolve, reject) => {
        if (!worksheet) {
            reject('No Worksheet Specified:🤔');
        }
        const totalRow = worksheet._rows.length;
        if(totalRow <= 1){
            reject(`No Data Available:🤔 in Excel`);
        }
        let rows = [];
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            if(rowNumber !== 1){
                rows.push(JSON.stringify(row.values));
            }
        });
        resolve(rows);
    });
};
