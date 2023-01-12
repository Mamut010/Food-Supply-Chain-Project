import { type Request, Response } from 'express';
const securityModule=require("../helpers/secur_util")
const { getProductContract, getProductBatchContract, disconnetGateway } = require('../utils/retailer_utils')

import * as manufacturer_utils from '../utils/manufacturer_utils'

import { TextDecoder } from 'util';
let utf8decoder = new TextDecoder();

// GET /retailer/productBatch/history with query request ?batchID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All product batch of the retailer unit
 */
 const getBatchHistory = async (req: Request, res: Response) => {
    let batchID = String(req.query.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET all product batch with batch id ${batchID} from Retailer Unit`);
        const result = await contract.evaluateTransaction('GetBatchHistory', batchID);
        res.status(200).send(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET retailer/product/history with query request ?productID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All history of product information of the retailer unit
 */
 const getProductHistory = async (req: Request, res: Response) => {
    let productID = String(req.query.productID);
    try {
        const contract = await getProductContract();
        console.log(`GET all product batch with batch id ${productID} from Retailer Unit`);
        const result = await contract.evaluateTransaction('GetProductHistory', productID);
        res.status(200).send(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /retailer/product/:productID
/**
 * @param req
 * @param res
 * @return product with given ID from retailer unit
 */
 const readProduct: any|Response = async (req: Request, res: Response) => {
    let productId = String(req.params.productID);
    if(securityModule.checkspecialchar(productId)) {
        try {
            const contract = await getProductContract();
            console.log(`GET a product batch with id ${productId} from Retailer Unit`)
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

// GET /retailer/productBatch/:batchID
/**
 * 
 * @param req 
 * @param res 
 * @returns product batch with given ID from retailer
 */
 const readProductBatch: any|Response = async (req: Request, res: Response) => {
    let productBatchId = String(req.params.productBatchId);
    if(securityModule.checkspecialchar(productBatchId)) {
        try {
            const contract = await getProductBatchContract();
            console.log(`GET a product batch with id ${productBatchId} from Retailer Unit`)
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

// GET /retailer/product/all/available
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

// GET /retailer/productBatch/status with query request ?productID=value 
/**
 * @description this function has the alias for the function above
 * @param req
 * @param res
 * @returns product batch information of the retailer by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
 const queryBatchesByStatus = async (req: Request, res: Response) => {
    let productID = String(req.query.productID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from retailer by giving productID: ${productID}`);
        const result = await contract.evaluateTransaction('QueryBatchesByStatus', productID);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /retailer/productBatch/status with query request ?status=status
/**
 * @description using this function with the support rich query from database
 * @param req
 * @param res
 * @returns product batch information of the retailer by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
 const getBatchByStatus = async (req: Request, res: Response) => {
    let status = String(req.query.status);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from retailer by giving status: ${status}`);
        const result = await contract.evaluateTransaction('GetBatchesByStatus', status);
        res.status(200).send(utf8decoder.decode(result));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /retailer/products with query request ?quantity=range
/**
 * @description using this unmarshal function from go lang 
 * @param req
 * @param res
 * @returns product information of the retailer by giving range
 */
 const getProductsByRange = async (req: Request, res: Response) => {
    let key1 = String(req.query.startID);
    let key2 = String(req.query.endID);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product from retailer by giving range from ${key1} to ${key2}`);
        const result = await contract.evaluateTransaction('GetProductsByRange', key1, key2);
        res.status(200).send(result);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}


// POST /retailer/productBatch/:batchID/sort with body request {"retailer":"","batchID":"","location":""}
/**
 * @param req
 * @param res
 * @description sort product batch from retailer
 * @returns sorted product batch
 */
 const sortProductBatch = async (req: Request, res: Response) => {
    try {
        var key1 =String(req.body.batchID)
        const contract = await getProductBatchContract();

        console.log(`Sort product batch namely: product batch id ${key1} in retailer`)
        const result = await contract.submitTransaction('SortBatchProducts', key1)
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())))
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
        disconnetGateway();
    }
}

// DELETE /retailer/products with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product batch with specific ID in Retailer Unit
 */
 const deleteProductBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["productBatchID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key =String(req.body.productBatch)
            const contract = await getProductBatchContract();
    
            console.log(`Delete the product batch ${key} in Retailer unit `)
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

// DELETE /retailer/productBatch/:batchID/product/:productID with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @description delete a product from product batch with specific ID in retailer
 */
 const deleteProductFromBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["retailer","batchID","productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.productID)
            const contract = await getProductBatchContract();

            console.log(`Delete the product ${key2} from product batch ${key1} in retailer `)
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

// Thinh custom function
const payment = async (productID: any) => {
    // This function should deal with online payment
    return true;
}

const retrieveManufacturerID = async () => {
    // This function should eventually return a manufacturer ID
    return "HAMBURG-MANUFACTURER";
}

const getManufacturerLocation = async (manufacturerID: string) => {
    // This function should eventually return a manufacturer location
    return "Hamburg";
}

// Thinh custom function
/**
 * @param req
 * @param res
 * @description purchase a product
 */
 const purchaseProduct:any|Response =  async (req: Request, res: Response) => {
    if(typeof req.body.productID === "undefined") {
        return res.status(400).send("invalid input");
    }

    if(! (await payment(req.body.productID))) {
        return res.status(400).send("please pay for the product");
    }

    try {
        var key1:string = String(req.body.batchID);
        var key2:string = String(req.body.productID);
        var key3:string = String(req.body.quantity);
        var key4:string = await retrieveManufacturerID();
        var key5:string = await getManufacturerLocation(key4);
        var key6:string = String(req.body.currentLocation);
        var key7:string = String(req.body.distributorID);
        var key8:string = String(req.body.retailerID);

        const contract = await manufacturer_utils.getProductBatchContract();

        console.log("Creating a batch...");
        await contract.submitTransaction('CreateProductBatch', key1, key2, key3, key4, key5);
        console.log("Setting destination...");
        await contract.submitTransaction('UpdateDestination', key1, key6);
        console.log("Setting distributor ID...");
        await contract.submitTransaction('UpdateDistributorID', key1, key7);
        console.log("Setting retailer ID...");
        await contract.submitTransaction('UpdateRetailerID', key1, key8);
        res.sendStatus(201);
    }
    catch(error) {
        return res.status(400).send("invalid input");
    }
    finally {
        manufacturer_utils.disconnetGateway();
    }
}

// Thinh custom function
/**
 * @param req
 * @param res
 * @description add a product to a batch
 */
 const addProductsToBatch:any|Response =  async (req: Request, res: Response) => {
    if(typeof req.body.productID === "undefined") {
        return res.status(400).send("invalid input");
    }

    if(! (await payment(req.body.productID))) {
        return res.status(400).send("please pay for the product");
    }

    try {
        var key1:string = String(req.body.batchID);
        var key2:string = String(req.body.productID);
        var key3:string = String(req.body.quantity);

        const contract = await manufacturer_utils.getProductBatchContract();

        console.log(`Adding ${key3} of product ${key2} to product batch ${key1}...`);
        await contract.submitTransaction('AddProductsToBatch', key1, key2, key3);
        res.sendStatus(201);
    }
    catch(error) {
        return res.status(400).send("invalid input");
    }
    finally {
        manufacturer_utils.disconnetGateway();
    }
}

// GET /retailer-unit/productBatch/query/all
/**
 * @description this function queries for all products
 * @param req
 * @param res
 * @returns all products
 */
 const queryAllProductBatches = async (req: Request, res: Response) => {
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of all products:`);
        const result = await contract.evaluateTransaction('QueryAllBatches');
        res.status(200).send(JSON.stringify(utf8decoder.decode(result)));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

module.exports = {
    readProduct, readProductBatch, getProductHistory, getBatchHistory, queryAllAvailableProducts,
    getProductsByRange, queryBatchesByStatus, getBatchByStatus,

    sortProductBatch, queryAllProductBatches, addProductsToBatch,
    

    deleteProductBatch, deleteProductFromBatch,

    purchaseProduct,
}