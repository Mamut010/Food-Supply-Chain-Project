//const { createContract, disconnetGateway } = require('../helpers/web_util'); // @version old version fabric 2.2
const securityModule = require('../helpers/secur_util');
import { Request, Response } from 'express';
const { getProductContract, getProductBatchContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/manufacturer_utils')

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
        res.send(JSON.parse(result.toString()));
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
        res.send(JSON.parse(result.toString()));
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
        res.send(result);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /manufacturer/products with query request ?category=catergory
/**
 * @param req
 * @param res
 * @returns product batch information of the manufacturer by giving category
 */
const getBatchByCategory = async (req: Request, res: Response) => {
    let category = JSON.stringify(req.query.category);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch by giving category: ${category}`);
        const result = await contract.evaluateTransaction('GetBatchByCategory', category);
        res.send(JSON.parse(result.toString()));
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
        res.send(JSON.parse(result.toString()));
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
        res.send(JSON.stringify(result));
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
        res.send(JSON.stringify(result));
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
        res.send(JSON.stringify(result));
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
        res.send(JSON.stringify(result));
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
        res.send(JSON.stringify(result));
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
    let batchID = JSON.stringify(req.query.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET all product batch with batch id ${batchID} from Manufacturer`);
        const result = await contract.evaluateTransaction('GetBatchHistory', batchID);
        res.send(JSON.parse(result.toString()));
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
    let productID = JSON.stringify(req.query.productID);
    try {
        const contract = await getProductContract();
        console.log(`GET all product batch with batch id ${productID} from Manufacturer`);
        const result = await contract.evaluateTransaction('GetProductHistory', productID);
        res.send(JSON.parse(result.toString()));
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
    let productBatchId = JSON.stringify(req.params.productBatchId);
    if(securityModule.checkspecialchar(productBatchId)) {
        try {
            const contract = await getProductBatchContract();
            console.log(`GET a product batch with id ${productBatchId} from Manufacturer`)
            let data = await contract.evaluateTransaction('ReadProductBatch',productBatchId)
            res.status(200).json(JSON.parse(data.toString()))
        } catch (error) {
            console.error("error: "+error);
            res.send(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("The ID provided contains special characters")
}

// GET /manufacturer/products/:productID
/**
 * 
 * @param req 
 * @param res 
 * @returns information of product 
 */
const readProduct: any|Response = async (req: Request, res: Response) => {
    let productId = JSON.stringify(req.params.productID);
    if(securityModule.checkspecialchar(productId)) {
        try {
            const contract = await getProductContract();
            console.log(`GET a product batch with id ${productId} from Manufacturer`)
            let data = await contract.evaluateTransaction('ReadProduct',productId)
            res.status(200).json(JSON.parse(data.toString()))
        } catch (error) {
            console.error("error: "+error);
            res.send(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("The ID provided contains special characters")
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
        res.send(500);
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
        var productID = JSON.stringify(req.body.productID);
        const contract = await getProductContract();
        console.log(`POST a product and mark that ${productID} as unavailable`)
        await contract.submitTransaction('MarkAsUnavailable', productID);
        res.sendStatus(201);
    } catch (error) {
        console.log('error' + error);
        res.send(500);
    } finally {
        disconnetGateway()
    }
}

// POST /manufacturer/productBatch with body request {"manufacturer":"","name":"","quantity":"","productionDate":""}
const createProductBatch = async (req: Request, res: Response) => {
    try {
        var key1:string = String(req.body.productBatchId);
        var key2:string = String(req.body.products);
        var key3:string = String(req.body.manufacturerID);
        var key4:string = String(req.body.distributorID);
        var key5:string = String(req.body.retailerID);
        var key6:string = String(req.body.productionDate);
        var key7:string = String(req.body.expirationDate);
        var key8:string = String(req.body.locationEntryInfo);
        const contract = await getProductBatchContract();
        console.log(`POST a product batch with product batch id ${key1}, products ${key2},
        manufacturer id ${key3}, distributor id ${key4}, retailer id ${key5}, 
        production date ${key6}, expiration date ${key7}, location entry information ${key8}`)
        await contract.submitTransaction('CreateProductBatch',key1,key2,key3,key4,key5,key6,key7,key8);
        res.sendStatus(201);
    } catch (error) {
        console.log('error: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
}

// POST manufacturer/products
const createProduct = async (req: Request, res: Response) => {
    try {
        var key1:string = String(req.body.productid);
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
        res.send(500);
    } finally {
        disconnetGateway();
    }
}

// POST manufacturer/products/product?available=true
const createProductAvailable = async (req: Request, res: Response) => {
    try {
        var key1:string = JSON.stringify(req.body.productID)
        var key2:string = JSON.stringify(req.body.name)
        var key3:string = JSON.stringify(req.body.origin)
        var key4:string = JSON.stringify(req.body.category)
        var key5:string = JSON.stringify(req.body.unitPrice)
        var key6:string = JSON.stringify(req.body.unitMeasurement)
        var key7:string = JSON.stringify(req.body.quantity)
        let isdigit:boolean =  /^\d+$/.test(key7);
        if (isdigit) {
            if(parseInt(key7)>10000) {
                key7 = "10000";
            }
        }
        if (!isdigit) {
            key7 = "10000";
        }
        var key8:string = JSON.stringify(req.body.productionDate)
        var key9:string = JSON.stringify(req.body.expirationDate)
        var key10:string = String(req.body.imageSrc);
        const contract = await getProductContract()
        console.log(`POST a product batch with product batch id ${key1}, name ${key2},
        origin ${key3}, category ${key4}, unit price ${key5}, unit measurement ${key6},
        quantity ${key7}, production date ${key8}, expiration date ${key9}, image source ${key10}`)
        await contract.submitTransaction('CreateProductAvailable',key1,key2,key3,key4,key5,key6,key7,key8,key9)
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
    var format1= ["manufacturer","batchID","productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.productID)
            const contract = await getProductBatchContract();
    
            console.log(`Update information of product batch namely batch id: ${key1}, product id: ${key2} in Manufacturer`)
            await contract.submitTransaction('AddProductsToBatch', key1,key2) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("wrong format")
}

// PUT /manufacturer/products/manufacturer?productID=value&productID=value...
// with body request  {"manufacturer":"value","productID":"","newname":"","newOrigin":"","newCategory":"","newUnitPrice":"","newUnitMeasurement":"","newQuantity":"","newProductionDate":"","newExpirationDate":""}
/**
 * @param req
 * @param res
 * @returns update product in the manufacturer with specific ID
 */
const updateProduct:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newname","newOrigin","newCategory","newUnitPrice","newUnitMeasurement","newQuantity","newProductionDate","newExpirationDate"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =JSON.stringify(req.body.productID)
            var key2 =JSON.stringify(req.body.newname)
            var key3 =JSON.stringify(req.body.newOrigin)
            var key4 =JSON.stringify(req.body.newCategory)
            var key5 =JSON.stringify(req.body.newUnitPrice)
            var key6 =JSON.stringify(req.body.newUnitMeasurement)
            var key7 =JSON.stringify(req.body.newQuantity)
            let isdigit:boolean =  /^\d+$/.test(key7);
            if (isdigit) {
                if(parseInt(key7)>10000) {
                    key7 = "10000";
                }
            }
            if (!isdigit) {
                key7 = "10000";
            }
            var key8 =JSON.stringify(req.body.newProductionDate)
            var key9 =JSON.stringify(req.body.newExpirationDate)
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
    else return res.send("wrong format")
}

// PUT /manufacturer/products/category with body request {"manufacturer":"","productID":"","newname":""}
/**
 * @param req
 * @param res
 * @returns the updating name of product in manufacturer with product id and new name
 */
const updateProductName:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newname"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/category with body request {"manufacturer":"","productID":"","newCategory":""}
/**
 * @param req
 * @param res
 * @returns updating the category of product from manufacturer with product id and new category
 */
const updateProductCategory:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newCategory"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/origin with body request {"manufacturer":"","productID":"","newOrigin":""}
/**
 * @param req
 * @param res
 * @returns updating the origin of product from manufacturer with product id and new origin
 */
const updateProductOrigin:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newOrigin"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/unitprice with body request {"manufacturer":"","productID":"","newUnitPrice":""}
/**
 * @param req
 * @param res
 * @returns updating the unit price of product from manufacturer with product id and new unit price
 */
const updateProductUnitPrice:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newUnitPrice"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/unitmeasurement with body request {"manufacturer":"","productID":"","newUnitMeasurement":""}
/**
 * @param req
 * @param res
 * @returns updating product unit of measurement from manufacturer with product id and new unit of measurement
 */
const updateProductUnitMeasurement:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newUnitMeasurement"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/quantity with body request {"manufacturer":"","productID":"","newQuantity":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new quantity
 */
const updateProductQuantity:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newQuantity"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/productionDate with body request {"manufacturer":"","productID":"","newProductionDate":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new production date
 */
const updateProductionDate:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newProductionDate"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/expirationDate with body request {"manufacturer":"","productID":"","newExpirationDate":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new expiration date
 */
 const updateExpirationDate:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newExpirationDate"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/products/newImageSrc with body request {"manufacturer":"","productID":"","newImageSrc":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from manufacturer with product id and new image source
 */
 const updateProductImageSource:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","productID","newImageSrc"]
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
    } else return res.send("wrong format")
}

// PUT /manufacturer/productBatch/location with body request {"manufacturer":"","productBatchID":"","newLocation":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of manufacturer with product batch id and new location
 */
const updateProductBatchLocation:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","batchID","newLocation"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productBatchID)
            var key2 =String(req.body.newLocation)
            const contract = await getProductBatchContract();

            console.log(`Update location of product batch namely: product batch id ${key1}, new location ${key2} in Manufacturer`)
            await contract.submitTransaction('UpdateLocationEntryInfo', key1,key2)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.send("wrong format")
}

// PUT /manufacturer/productBatch/deliver with body request {"manufacturer":"","batchID":"","distributorID":"","location":""}
/**
 * @param req
 * @param res
 * @description deliver product batch from manufacturer to distributor
 */
const deliverBatchToDistributor:any|Response = async (req: Request, res: Response) => {
    var format1= ["manufacturer","batchID","distributorID","location"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.distributorID)
            var key3 =String(req.body.location)
            const contract = await getProductBatchContract();

            console.log(`Deliver product batch namely: product batch id ${key1}, distributor id ${key2}, location ${key3} in Manufacturer`)
            await contract.submitTransaction('SendBatchToDistributor', key1,key2,key3)
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    } else return res.send("wrong format")
}

// DELETE /manufacturer/products with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product batch with specific ID in Manufacturer
 */
const deleteProductBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["productBatchID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key =String(req.body.productBatch)
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
    else return res.send("wrong format")
    
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
            var key =String(req.body.productBatch)
            const contract = await getProductContract();
    
            console.log(`Delete the product batch ${key} in Manufacturer `)
            await contract.submitTransaction('DeleteProduct', key) 
            res.sendStatus(200)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(500)
        } finally {
            disconnetGateway();
        }
    }
    else return res.send("wrong format")
    
}

module.exports = {
    productExists, batchExists, getBatchHistory, getProductHistory, readProductBatch,
    readProduct, getProductsByRange, getBatchByCategory, queryProducts, queryProductsByCategory,
    QueryProductsByName, queryAllProducts, queryAllAvailableProducts, queryAllUnavailableProducts,

    createProductBatch, createProduct, deliverBatchToDistributor, markAsAvailable,
    createProductAvailable, markAsUnavailable,

    updateProductBatchLocation, updateProductBatch, updateProductUnitPrice, 
    updateProductUnitMeasurement, updateProductQuantity, updateProduct,
    updateProductName, updateProductCategory, updateProductOrigin, updateProductionDate,
    updateExpirationDate, updateProductImageSource,
    
    deleteProductBatch,
    deleteProduct
}