const fs = require('fs');

module.exports.readFilePro = (file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file,'utf8',(err, data) => {
        if (err) reject('I could not find that file 😢');
        resolve(data);
      });
    });
  };

module.exports.writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, err => {
        if (err) reject('Could not write file 😢');
        resolve('success');
      });
    });
  };

module.exports.appendFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.appendFile(file, data, err => {
        if (err) reject('Could not append file 😢');
        resolve('success');
      });
    });
  };


module.exports.readMutiplesFilePro = (filesArray) => {
    return new Promise((resolve, reject) => {
      if(filesArray.length === 0 || filesArray === undefined){
        reject("Invalid Files")
      }
      const fileBins = Promise.all(filesArray.map(file => this.readFilePro(file)))
      return resolve(fileBins);
    });
  };