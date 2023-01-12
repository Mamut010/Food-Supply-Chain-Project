import {formatDate} from '../utils/date-helpers.js'

export const fetchGetAllProductBatches = async (url) => {
    try {
        let obj = await fetch(url, {
            mode: 'cors',
        });
        let jsonObjs = JSON.parse(await obj.json());

        jsonObjs.forEach((element) => {
            element['product-list'] = "";
            const products = element.products;
            for(let i = 0; i < products.length; i++) {
                element['product-list'] += (i === 0) ? products[i].id : ", " + products[i].id;
            }
            
            element['manufacturerid'] = element.manufacturerID;
            element['distributorid'] = element.distributorID;
            element['retailerid'] = element.retailerID;

            const locationEntryInfo = element.locationEntryInfo;
            element['destination'] = locationEntryInfo.destination;
            element['currentLocation'] = locationEntryInfo.currentLocation;
            element['arrivalTimestamp'] = formatDate(locationEntryInfo.ArrivalTimestamp);
        });

        return jsonObjs;
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return [];
    }
}

export const fetchDeleteProductBatch = async (url, id) => {
    try {
        const data = {batchID : id};
        let res = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(data)// body data type must match "Content-Type"
        });

        if(res.status === 200) {
            console.log(`Product Batch ${id} deleted successfully...`);
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchCreateProductBatch = async (createURL, destinationURL, inputs) => {
    try {
        let res = await fetch(createURL, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(inputs)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            let destinationData = {batchID: inputs.batchID, newDestination: inputs.destination};
            res = await fetch(destinationURL, {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors',
    
                headers: {
                    'Content-Type': 'application/json'
                },
    
                body:  JSON.stringify(destinationData)// body data type must match "Content-Type"
            });

            if(res.status === 201) {
                console.log(`Product batch created successfully...`);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchUpdateProductBatchLocation = async (url, inputs) => {
    try {
        let res = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(inputs)// body data type must match "Content-Type"
        });

        if(res.status === 200) {
            console.log(`Location of Product Batch ${inputs.batchID} updated successfully...`);
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchUpdateProductBatchDistributor = async (url, inputs) => {
    try {
        let res = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(inputs)// body data type must match "Content-Type"
        });

        if(res.status === 200) {
            console.log(`Distributor of Product Batch ${inputs.batchID} updated successfully...`);
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchPurchaseProduct = async (url, inputs) => {
    try {
        let res = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(inputs)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            console.log(`Product Batch ${inputs.batchID} created successfully...`);
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchAddProductsToBatch = async (url, inputs) => {
    try {
        let res = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(inputs)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchMarkBatchAsDelivered = async (url, id) => {
    try {
        const data = {batchID : id};
        let res = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(data)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            return true;
        }
        else {
            return false;
        }
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return false;
    }
}

export const fetchGetProductBatchHistory = async (url) => {
    try {
        const res = await fetch(url, {
            mode: 'cors'
        })
    
        const historyData = await res.json();
    
        const result = []
        for(let i = 0; i < historyData.length; i++) {
            if(historyData[i]['isDelete']) {
                break;
            }
    
            const data = {};
            data['timestamp'] = historyData[i]['timestamp'];
            data['date'] = formatDate(data['timestamp']);
            
            const record = historyData[i]['record'];
            data['id'] = record['id'];
            data['product-list'] = '';
            const products = record.products;
            for(let j = 0; j < products.length; j++) {
                data['product-list'] += (j === 0) ? products[j].id : ', ' + products[j].id;
            }
            
            data['manufacturerid'] = record.manufacturerID;
            data['distributorid'] = record.distributorID;
            data['retailerid'] = record.retailerID;
    
            const locationEntryInfo = record.locationEntryInfo;
            data['destination'] = locationEntryInfo.destination;
            data['currentLocation'] = locationEntryInfo.currentLocation;
            data['arrivalTimestamp'] = formatDate(locationEntryInfo.ArrivalTimestamp);
            data['status'] = record['status'];
            result.push(data);
        }
    
        return result;
    }
    catch(err) {
        throw err;
    }
}