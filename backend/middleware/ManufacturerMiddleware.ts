//const { createContract, disconnetGateway } = require('../helpers/web_util'); // @version old version fabric 2.2
const securityModule = require('../helpers/secur_util');
import { Request, Response } from 'express';
const { getProductContract, getProductBatchContract, disconnetGateway } = require('../utils/manufacturer_utils')

import { TextDecoder } from 'util';
let utf8decoder = new TextDecoder();

// GET /manufacturer/products with query request ?productID=value
/**
 * @param req
 * @param res
 * @returns product information of the manufacturer
 */
const productExists = async (req: Request, res: Response) => {
    let productID = JSON.stringify(req.query.productID);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product by giving productID: ${productID}`);
        const result = await contract.evaluateTransaction('ProductExists', productID);
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch with query request ?batchID=value
/**
 * @param req
 * @param res
 * @returns product batch information of the manufacturer
 */
const batchExists = async (req: Request, res: Response) => {
    let batchID = JSON.stringify(req.query.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch by giving batchID: ${batchID}`);
        const result = await contract.evaluateTransaction('BatchExists', batchID);
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products with query request ?quantity=range
/**
 * @description using this unmarshal function from go lang 
 * @param req
 * @param res
 * @returns product information of the manufacturer by giving range
 */
const getProductsByRange = async (req: Request, res: Response) => {
    let key1 = JSON.stringify(req.query.startID);
    let key2 = JSON.stringify(req.query.endID);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product from manufacturer by giving range from ${key1} to ${key2}`);
        const result = await contract.evaluateTransaction('GetProductsByRange', key1, key2);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/range with query request ?quantity=range
/**
 * @description using this unmarshal function from go lang
 * @param req
 * @param res
 * @returns product batch information of the manufacturer by giving range
 */
const getBatchByRange = async (req: Request, res: Response) => {
    let key1 = JSON.stringify(req.query.startID);
    let key2 = JSON.stringify(req.query.endID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from manufacturer by giving range from ${key1} to ${key2}`);
        const result = await contract.evaluateTransaction('GetBatchesByRange', key1, key2);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/status with query request ?status=status
/**
 * @description using this function with the support rich query from database
 * @param req
 * @param res
 * @returns product batch information of the manufacturer by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
const getBatchByStatus = async (req: Request, res: Response) => {
    let status = JSON.stringify(req.query.status);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from manufacturer by giving status: ${status}`);
        const result = await contract.evaluateTransaction('GetBatchesByStatus', status);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/status with query request ?productID=value 
/**
 * @description this function has the alias for the function above
 * @param req
 * @param res
 * @returns product batch information of the manufacturer by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
const queryBatchesByStatus = async (req: Request, res: Response) => {
    let productID = JSON.stringify(req.query.productID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from manufacturer by giving productID: ${productID}`);
        const result = await contract.evaluateTransaction('QueryBatchesByStatus', productID);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}



// GET /manufacturer/products with query request ?category=catergory
/**
 * @description this function has the alias for the function above
 * @param req
 * @param res
 * @returns product batch information of the manufacturer by giving category
 */
const queryProductsByCategory = async (req: Request, res: Response) => {
    let category = JSON.stringify(req.query.category);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product batch by giving category: ${category}`);
        const result = await contract.evaluateTransaction('QueryProductsByCategory', category);
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products with query request ?name=name
/**
 * @description using this function with the support rich query from database
 * @param req
 * @param res
 * @returns product information of the manufacturer by giving name 
 */
const QueryProductsByName = async (req: Request, res: Response) => {
    let name = JSON.stringify(req.query.name);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product by giving name: ${name}`);
        const result = await contract.evaluateTransaction('QueryProductsByName', name);
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products with query request ?query=products 
/**
 * @description this function uses a query string to perform a query for products
 * @param req
 * @param res
 * @returns product information of the manufacturer by giving query string
 */
const queryProducts = async (req: Request, res: Response) => {
    let queryString = JSON.stringify(req.query.queryString);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product by giving query string: ${queryString}`);
        const result = await contract.evaluateTransaction('QueryProducts', queryString);
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products/all
/**
 * @description this function queries for all products
 * @param req
 * @param res
 * @returns all products
 */
const queryAllProducts = async (req: Request, res: Response) => {
    try {
        const contract = await getProductContract();
        console.log(`GET information of all products:`);
        const result = await contract.evaluateTransaction('QueryAllProducts');
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/all
/**
 * @description this function queries for all product batches
 * @param req
 * @param res
 * @returns all product batches
 */
const queryAllProductBatches = async (req: Request, res: Response) => {
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of all product batches:`);
        const result = await contract.evaluateTransaction('QueryAllBatches');
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products/all/available
/**
 * @description this function queries for all available products
 * @param req
 * @param res
 * @returns all products
 */
 const queryAllAvailableProducts = async (req: Request, res: Response) => {
    try {
        const contract = await getProductContract();
        console.log(`GET information of all available products:`);
        const result = await contract.evaluateTransaction('QueryAllAvailableProducts');
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products/all/unavailable
/**
 * @description this function queries for all unavailable products
 * @param req
 * @param res
 * @returns all products
 */
 const queryAllUnavailableProducts = async (req: Request, res: Response) => {
    try {
        const contract = await getProductContract();
        console.log(`GET information of all available products:`);
        const result = await contract.evaluateTransaction('QueryAllUnavailableProducts');
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/history with query request ?batchID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All product batch of the manufacturer
 */
const getBatchHistory = async (req: Request, res: Response) => {
    let batchID = String(req.params.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET history of product batch with batch id ${batchID} from Manufacturer`);
        const result = await contract.evaluateTransaction('GetBatchHistory', batchID);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products/history/product with query request ?productID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All history of product information of the manufacturer
 */
const getProductHistory = async (req: Request, res: Response) => {
    let productID = JSON.stringify(req.params.productID);
    try {
        const contract = await getProductContract();
        console.log(`GET history of product with product id ${productID} from Manufacturer`);
        const result = await contract.evaluateTransaction('GetProductHistory', productID);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/productBatch/:batchID
/**
 * 
 * @param req 
 * @param res 
 * @returns information of product batch
 */
const readProductBatch: any|Response = async (req: Request, res: Response) => {
    let batchID = JSON.stringify(req.params.batchID);
    if(securityModule.checkspecialchar(batchID)) {
        try {
            const contract = await getProductBatchContract();
            console.log(`GET a product batch with id ${batchID} from Manufacturer`)
            let data = await contract.evaluateTransaction('ReadProductBatch',batchID)
            res.status(200).json(JSON.parse(utf8decoder.decode(data.toString())))
        } catch (error) {
            console.error("error: "+error);
            res.status(500).send(error)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("The ID provided contains special characters")
}

// GET /manufacturer/products/:productID
/**
 * 
 * @param req 
 * @param res 
 * @returns information of product 
 */
const readProduct: any|Response = async (req: Request, res: Response) => {
    let productID = JSON.stringify(req.params.productID);
    if(securityModule.checkspecialchar(productID)) {
        try {
            const contract = await getProductContract();
            console.log(`GET a product batch with id ${productID} from Manufacturer`)
            let data = await contract.evaluateTransaction('ReadProduct',productID)
            res.status(200).json(JSON.parse(utf8decoder.decode(data.toString())))
        } catch (error) {
            console.error("error: "+error);
            res.status(500).send(error)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("The ID provided contains special characters")
}

//POST /manufacturer/products/available
/**
 * 
 * @param req 
 * @param res 
 * @description marking a product as available
 */
const markAsAvailable = async (req: Request, res: Response) => {
    try {
        var productID = String(req.body.productID);
        const contract = await getProductContract();
        console.log(`POST a product and mark that ${productID} as available`)
        await contract.submitTransaction('MarkAsAvailable', productID);
        res.sendStatus(201);
    } catch (error) {
        console.log('error' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway()
    }
}

//POST /manufacturer/products/unavailable
/**
 * 
 * @param req 
 * @param res 
 * @description marking a product as unavailable
 */
 const markAsUnavailable = async (req: Request, res: Response) => {
    try {
        var productID = String(req.body.productID);
        const contract = await getProductContract();
        console.log(`POST a product and mark that ${productID} as unavailable`)
        await contract.submitTransaction('MarkAsUnavailable', productID);
        res.sendStatus(201);
    } catch (error) {
        console.log('error' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway()
    }
}

// POST /manufacturer/productBatch with body request {"manufacturer":"","productID":"","quantity":"","productionDate":""}
const createProductBatch = async (req: Request, res: Response) => {
    try {
        var key1:string = String(req.body.batchID);
        var key2:string = String(req.body.productID);
        var key3:string = String(req.body.quantity);
        var key4:string = String(req.body.manufacturerID);
        var key5:string = String(req.body.currentLocation);
        const contract = await getProductBatchContract();
        console.log(`POST a product batch with product batch id ${key1}, product id ${key2},
        quantity ${key3}, manufacturer id ${key4}, current location ${key5}, `)
        await contract.submitTransaction('CreateProductBatch',key1,key2,key3,key4,key5);
        res.sendStatus(201);
    } catch (error) {
        console.log('error: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// POST manufacturer/products
const createProduct = async (req: Request, res: Response) => {
    try {
        var key1:string = String(req.body.productID);
        var key2:string = String(req.body.name);
        var key3:string = String(req.body.origin);
        var key4:string = String(req.body.category);
        var key5:string = String(req.body.unitPrice);
        var key6:string = String(req.body.unitMeasurement);
        var key7:string = String(req.body.quantity);
        let isdigit:boolean =  /^\d+$/.test(key7);
        if (isdigit) {
            if(parseInt(key7)>10000) {
                key7 = "10000";
            }
        }
        if (!isdigit) {
            key7 = "10000";
        }
        var key8:string = String(req.body.productionDate);
        var key9:string = String(req.body.expirationDate);
        var key10:string = String(req.body.imageSrc);
        const contract = await getProductContract();
        console.log(`POST a product batch with product batch id ${key1}, name ${key2},
        origin ${key3}, category ${key4}, unit price ${key5}, unit measurement ${key6},
        quantity ${key7}, production date ${key8}, expiration date ${key9}, image source ${key10}`)
        await contract.submitTransaction('CreateProduct',key1,key2,key3,key4,key5,key6,key7,key8,key9,key10);
        res.sendStatus(201);
    } catch (error) {
        console.log('error: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// POST manufacturer/products/product?available=true
const createProductAvailable = async (req: Request, res: Response) => {
    try {
        var key1:string = String(req.body.productID)
        var key2:string = String(req.body.name)
        var key3:string = String(req.body.origin)
        var key4:string = String(req.body.category)
        var key5:string = String(req.body.unitPrice)
        var key6:string = String(req.body.unitMeasurement)
        var key7:string = String(req.body.quantity)
        let isdigit:boolean =  /^\d+$/.test(key7);
        if (isdigit) {
            if(parseInt(key7)>10000) {
                key7 = "10000";
            }
        }
        if (!isdigit) {
            key7 = "10000";
        }
        var key8:string = String(req.body.productionDate)
        var key9:string = String(req.body.expirationDate)
        var key10:string = String(req.body.imageSrc);
        const contract = await getProductContract()
        console.log(`POST a product with product id ${key1}, name ${key2},
        origin ${key3}, category ${key4}, unit price ${key5}, unit measurement ${key6},
        quantity ${key7}, production date ${key8}, expiration date ${key9}, image source ${key10}`)
        await contract.submitTransaction('CreateProductAvailable',key1,key2,key3,key4,key5,key6,key7,key8,key9,key10)
        res.sendStatus(201)
    } catch (error) {
        console.error('error: ' + error)
        res.sendStatus(500)
    } finally {
        disconnetGateway()
    }
}

// PUT /manufacturer/products with body request {"manufacturer":"","batchID":"","productID":"","productionDate":""}
/**
 * @param req
 * @param res
 * @returns update product batch in the manufacturer with specific ID
 */
const updateProductBatch:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","productID","quantity"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.productID)
            var key3 =String(req.body.quantity)
            let isdigit:boolean =  /^\d+$/.test(key3);
            if (isdigit) {
                if(parseInt(key3)>10000) {
                    key3 = "10000";
                }
            }
            if (!isdigit) {
                key3 = "10000";
            }
            const contract = await getProductBatchContract();
    
            console.log(`Update information of product batch namely batch id: ${key1}, product id: ${key2}, quantity: ${key3} in Manufacturer`)
            await contract.submitTransaction('AddProductsToBatch', key1,key2,key3) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/manufacturer?productID=value&productID=value...
// with body request  {"manufacturer":"value","productID":"","newname":"","newOrigin":"","newCategory":"","newUnitPrice":"","newUnitMeasurement":"","newQuantity":"","newProductionDate":"","newExpirationDate":""}
/**
 * @param req
 * @param res
 * @returns update product in the manufacturer with specific ID
 */
const updateProduct:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newname","newOrigin","newCategory","newUnitPrice","newUnitMeasurement","newQuantity","newProductionDate","newExpirationDate"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newname)
            var key3 =String(req.body.newOrigin)
            var key4 =String(req.body.newCategory)
            var key5 =String(req.body.newUnitPrice)
            var key6 =String(req.body.newUnitMeasurement)
            var key7 =String(req.body.newQuantity)
            let isdigit:boolean =  /^\d+$/.test(key7);
            if (isdigit) {
                if(parseInt(key7)>10000) {
                    key7 = "10000";
                }
            }
            if (!isdigit) {
                key7 = "10000";
            }
            var key8 =String(req.body.newProductionDate)
            var key9 =String(req.body.newExpirationDate)
            const contract = await getProductContract();
    
            console.log(`Update information of product namely: product id ${key1},
             new name ${key2}, new origin ${key3}, new category ${key4}, new unit price ${key5}, 
             new unit measurement ${key6}, new quantity ${key7}, new production date ${key8},
             new expiration date ${key9} in Manufacturer`)
            await contract.submitTransaction('UpdateProduct', key1,key2,key3,key4,key5,key6,key7,key8,key9) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/category with body request {"manufacturer":"","productID":"","newname":""}
/**
 * @param req
 * @param res
 * @returns the updating name of product in manufacturer with product id and new name
 */
const updateProductName:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newname"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newname)
            const contract = await getProductContract();

            console.log(`Update name of product namely: product id ${key1}, new name ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductName', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/category with body request {"manufacturer":"","productID":"","newCategory":""}
/**
 * @param req
 * @param res
 * @returns updating the category of product from manufacturer with product id and new category
 */
const updateProductCategory:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newCategory"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newCategory)
            const contract = await getProductContract();

            console.log(`Update category of product namely: product id ${key1}, new category ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductCategory', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/origin with body request {"manufacturer":"","productID":"","newOrigin":""}
/**
 * @param req
 * @param res
 * @returns updating the origin of product from manufacturer with product id and new origin
 */
const updateProductOrigin:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newOrigin"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newOrigin)
            const contract = await getProductContract();
            
            console.log(`Update origin of product namely: product id ${key1}, new origin ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductOrigin', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/unitprice with body request {"manufacturer":"","productID":"","newUnitPrice":""}
/**
 * @param req
 * @param res
 * @returns updating the unit price of product from manufacturer with product id and new unit price
 */
const updateProductUnitPrice:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newUnitPrice"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newUnitPrice)
            const contract = await getProductContract();

            console.log(`Update unit price of product namely: product id ${key1}, new unit price ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductUnitPrice', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/unitmeasurement with body request {"manufacturer":"","productID":"","newUnitMeasurement":""}
/**
 * @param req
 * @param res
 * @returns updating product unit of measurement from manufacturer with product id and new unit of measurement
 */
const updateProductUnitMeasurement:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newUnitMeasurement"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newUnitMeasurement)
            const contract = await getProductContract();

            console.log(`Update unit measurement of product namely: product id ${key1}, new unit measurement ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductUnitMeasurement', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/quantity with body request {"manufacturer":"","productID":"","newQuantity":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new quantity
 */
const updateProductQuantity:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newQuantity"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newQuantity)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new quantity ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductQuantity', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/productionDate with body request {"manufacturer":"","productID":"","newProductionDate":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new production date
 */
const updateProductionDate:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newProductionDate"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newProductionDate)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new production date ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductProductionDate', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/expirationDate with body request {"manufacturer":"","productID":"","newExpirationDate":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new expiration date
 */
 const updateExpirationDate:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newExpirationDate"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newExpirationDate)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new expiration date ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductExpirationDate', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/products/newImageSrc with body request {"manufacturer":"","productID":"","newImageSrc":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new image source
 */
 const updateProductImageSource:any|Response = async (req: Request, res: Response) => {
    var format1= ["productID","newImageSrc"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newImageSrc)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new image source ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateProductImageSource', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/productBatch/location with body request {"manufacturer":"","batchID":"","newLocation":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of manufacturer with product batch id and new location
 */
const updateProductBatchLocation:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newLocation"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newLocation)
            const contract = await getProductBatchContract();

            console.log(`Update current location of product batch namely: product batch id ${key1}, new location ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateCurrentLocation', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/productBatch/destination with body request {"manufacturer":"","batchID":"","newDestination":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of manufacturer with product batch id and new destination
 */
 const updateProductBatchDestination:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID", "newDestination"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newDestination)
            const contract = await getProductBatchContract();

            console.log(`Update current location of product batch namely: product batch id ${key1}, new destination ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateDestination', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/productBatch/:batchID/distributor/:distributorID with body request {"manufacturer":"","batchID":"","newDistributorID":""}
/**
 * @param req
 * @param res
 * @description updating the distributor id of product batch from manufacturer with product batch id and new distributor id
 */
const updateProductBatchDistributor:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newDistributorID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newDistributorID)
            const contract = await getProductBatchContract();

            console.log(`Update distributor id of product batch namely: product batch id ${key1}, new distributor id ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateDistributorID', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// PUT /manufacturer/productBatch/:batchID/retailer/:retailerID with body request {"manufacturer":"","batchID":"","newRetailerID":""}
/**
 * @param req
 * @param res
 * @description updating the retailer id of product batch from manufacturer with product batch id and new retailer id
 */
const updateProductBatchRetailer:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newRetailerID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newRetailerID)
            const contract = await getProductBatchContract();

            console.log(`Update retailer id of product batch namely: product batch id ${key1}, new retailer id ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateRetailerID', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}


// POST /manufacturer/productBatch/:batchID/distributor/:distributorID/deliver with body request {"manufacturer":"","batchID":"","distributorID":"","location":""}
/**
 * @param req
 * @param res
 * @description deliver product batch from manufacturer to distributor
 */
const deliverBatchToDistributor:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            const contract = await getProductBatchContract();

            console.log(`Deliver product batch namely: product batch id ${key1} in Manufacturer`)
            await contract.submitTransaction('SendBatchToDistributor', key1)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// POST /manufacturer/productBatch/:batchID/retailer/:retailerID/deliver with body request {"manufacturer":"","batchID":""}
/** 
 * @param req
 * @param res
 * @description deliver product batch from manufacturer to retailer
 */
const deliverBatchToRetailer:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            const contract = await getProductBatchContract();

            console.log(`Deliver product batch namely: product batch id ${key1} in Manufacturer`)
            await contract.submitTransaction('SendBatchToRetailer', key1)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}

// POST /manufacturer/productBatch/:batchID/sort with body request {"manufacturer":"","batchID":"","location":""}
/**
 * @param req
 * @param res
 * @description sort product batch from manufacturer
 * @returns sorted product batch
 */
const sortProductBatch = async (req: Request, res: Response) => {
    try {
        var key1 =String(req.body.batchID)
        const contract = await getProductBatchContract();

        console.log(`Sort product batch namely: product batch id ${key1} in Manufacturer`)
        const result = await contract.submitTransaction('SortBatchProducts', key1)
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())))
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
        disconnetGateway();
    }
}

        

// DELETE /manufacturer/products with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product batch with specific ID in Manufacturer
 */
const deleteProductBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["batchID"]

    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key =String(req.body.batchID)
            const contract = await getProductBatchContract();
    
            console.log(`Delete the product batch ${key} in Manufacturer `)
            await contract.submitTransaction('DeleteProductBatch', key) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("wrong format")
    
}

// DELETE /manufacturer/productBatch/:batchID/product/:productID with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @description delete a product from product batch with specific ID in Manufacturer
 */
const deleteProductFromBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["batchID","productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.productID)
            const contract = await getProductBatchContract();

            console.log(`Delete the product ${key2} from product batch ${key1} in Manufacturer `)
            await contract.submitTransaction('RemoveBatchProduct', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.status(500).send("wrong format")
}


// DELETE /manufacturer/products with body request {"product":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product with specific ID in Manufacturer
 */
 const deleteProduct:any|Response =  async (req: Request, res: Response) => {
    var format1= ["productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key =String(req.body.productID)
            const contract = await getProductContract();
    
            console.log(`Delete the product ${key} in Manufacturer `)
            await contract.submitTransaction('DeleteProduct', key) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.status(500).send("wrong format")
    
}

module.exports = {
    productExists, batchExists, getBatchHistory, getProductHistory, readProductBatch,
    readProduct, getProductsByRange, queryProducts, queryProductsByCategory,
    QueryProductsByName, queryAllProducts, queryAllAvailableProducts, queryAllUnavailableProducts,
    getBatchByRange, getBatchByStatus, queryBatchesByStatus, queryAllProductBatches,

    createProductBatch, createProduct, deliverBatchToDistributor, markAsAvailable,
    createProductAvailable, markAsUnavailable, deliverBatchToRetailer,
    sortProductBatch,

    updateProductBatchLocation, updateProductBatchDestination,
    updateProductBatch, updateProductUnitPrice, updateProductBatchDistributor,
    updateProductUnitMeasurement, updateProductQuantity, updateProduct,
    updateProductName, updateProductCategory, updateProductOrigin, updateProductionDate,
    updateExpirationDate, updateProductImageSource, updateProductBatchRetailer,
    
    deleteProductBatch, deleteProductFromBatch,
    deleteProduct
}