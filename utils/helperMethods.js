/* 
    @Input arr & properties array
    @Output Return Object with filtered properties
*/
module.exports.extractProperties = (arr, properties) => {
	return arr.map((obj)=> Object.keys(obj).reduce((acc,key)=>{
	  if(properties.includes(key))    
		acc[key] = obj[key];  
	  return acc;
	},{}));
  }

/* 
    @Input arr 
    @Output Returns array of keys
*/
module.exports.extractKeys = (arr) =>{
    if(arr.length === 0 || arr === undefined){
        return new Error('Error in  Input');
    }
	return Object.keys(Object.assign({}, ...arr));
}


/* 
    @Input arr and keyArray
    @Output Returns Object based on keyarray
*/
module.exports.convaertArrayToObjects = (arr,keyArray) =>{
	if(arr.length > 1){
		let obj = {};
		let keys = [...keyArray];
		let filteredArray = arr.filter(el => el!== null);
		if(keys.length !== filteredArray.length){
			return new Error("Array Data Mismatch 🥵");
		}
		// Using loop to insert key 
		// value in Object 
		keys.map((el,index)=>{
			obj[el]=filteredArray[index];
		})
		return obj;
	}
	return new Error("Array is Empty 🥵");
}

/* 
    @Input nestedArrays and  keyArray
    @Output Returns Array of Objects
*/
module.exports.convertNestedArraysToObjects = (nestedArrays,keyArray) =>{
	if(nestedArrays.length > 0){
		let keys = [...keyArray];
		let final = [];
		for(let innerArray of nestedArrays){
			final.push(this.convaertArrayToObjects(JSON.parse(innerArray),keys));
		}
		return final;
	}
	return new Error("Array is Empty 🥵");
}