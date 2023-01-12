import {formatDate} from '../utils/date-helpers.js'

export const fetchGetAllProducts = async (url) => {
    try {
        let obj = await fetch(url, {
            mode: 'cors',
        });
        console.log("Fetched successfully...");
        let jsonObjs = JSON.parse(await obj.json());

        jsonObjs.forEach((element) => {
            element['price'] = element.unitPrice;
            element['measurement'] = element.unitMeasurement;
            element['product'] = element.name;
            element['productionDate'] = formatDate(element.productionDate);
            element['expirationDate'] = formatDate(element.expirationDate);
        });

        return jsonObjs;
    }
    catch(err) {
        console.log("An error occured when fetching: " + err.message);
        return [];
    }
}

export const fetchDeleteProduct = async (url, id) => {
    try {
        const data = {productID : id};
        let res = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(data)// body data type must match "Content-Type"
        });

        if(res.status === 200) {
            console.log(`Product ${id} deleted successfully...`);
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

export const fetchCreateProduct = async (url, inputs) => {
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
            console.log(`Product created successfully...`);
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

export const fetchMarkAsAvailable = async (url, id) => {
    try {
        const data = {productID : id};
        let res = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(data)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            console.log(`Product ${id} marked as available...`);
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

export const fetchMarkAsUnavailable = async (url, id) => {
    try {
        const data = {productID : id};
        let res = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',

            headers: {
                'Content-Type': 'application/json'
            },

            body:  JSON.stringify(data)// body data type must match "Content-Type"
        });

        if(res.status === 201) {
            console.log(`Product ${id} marked as unavailable...`);
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