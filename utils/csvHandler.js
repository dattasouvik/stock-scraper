module.exports.prepareExcelData = (dataArray,
    keyArray = [
        'stock',
        'price',
        'todaysLow',
        'todaysHigh',
        'change',
        'capturedOn',
        'target',
        'matched',
        'time']) => {
    return new Promise((resolve, reject) => {
        if(dataArray === '' || dataArray.length === 0){
            reject('Invalid data format 😢');
        }
        let data = 'Stock'+'\t'+'Price'+'\t'+'TodaysLow'+'\t'+'TodaysHigh'+'\t'+'Change(%)'+'\t'+'Captured On'+'\t'+'Target Price(Rs)'+'\t'+'Matched'+'\t'+'Timestamp'+'\n';
        const keys = [...keyArray];
        for (let i = 0; i < dataArray.length; i++) {
            data += dataArray[i][keys[0]]+'\t'+
                    dataArray[i][keys[1]]+'\t'+
                    dataArray[i][keys[2]]+'\t'+
                    dataArray[i][keys[3]]+'\t'+
                    dataArray[i][keys[4]]+'\t'+
                    dataArray[i][keys[5]]+'\t'+
                    dataArray[i][keys[6]]+'\t'+
                    dataArray[i][keys[7]]+'\t'+
                    dataArray[i][keys[8]]+'\n';
        }
        resolve(data);
    });
}