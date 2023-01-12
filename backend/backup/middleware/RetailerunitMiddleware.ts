import { type Request, Response } from 'express';
const securityModule=require("../helpers/secur_util")
const { getProductContract, getProductBatchContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/retailer_utils')

// GET /retailer/productBatch/history with query request ?batchID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All product batch of the retailer unit
 */
 const getBatchHistory = async (req: Request, res: Response) => {
    let batchID = JSON.stringify(req.query.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET all product batch with batch id ${batchID} from Retailer Unit`);
        const result = await contract.evaluateTransaction('GetBatchHistory', batchID);
        res.send(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET manufacturer/product/history with query request ?productID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All history of product information of the retailer unit
 */
 const getProductHistory = async (req: Request, res: Response) => {
    let productID = JSON.stringify(req.query.productID);
    try {
        const contract = await getProductContract();
        console.log(`GET all product batch with batch id ${productID} from Retailer Unit`);
        const result = await contract.evaluateTransaction('GetProductHistory', productID);
        res.send(JSON.parse(result.toString()));
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
    let productId = JSON.stringify(req.params.productID);
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
    let productBatchId = JSON.stringify(req.params.productBatchId);
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

// GET /manufacturer/product/all/available
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

// GET /retailer/products with query request ?quantity=range
/**
 * @description using this unmarshal function from go lang 
 * @param req
 * @param res
 * @returns product information of the retailer by giving range
 */
 const getProductsByRange = async (req: Request, res: Response) => {
    let key1 = JSON.stringify(req.query.startID);
    let key2 = JSON.stringify(req.query.endID);
    try {
        const contract = await getProductContract();
        console.log(`GET information of product from retailer by giving range from ${key1} to ${key2}`);
        const result = await contract.evaluateTransaction('GetProductsByRange', key1, key2);
        res.send(result);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// PUT /retailer/product with body request {"retailer":"","productID":"","newname":"","newOrigin":"","newCategory":"","newUnitPrice":"","newUnitMeasurement":""}
/**
 * @param req
 * @param res
 * @returns update product in the manufacturer with specific ID
 */
 const updateProduct:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newname","newOrigin","newCategory","newUnitPrice","newUnitMeasurement","newQuantity","newProductionDate","newExpirationDate"]
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

// PUT /retailer/products/name with body request {"manufacturer":"","productID":"","newname":""}
/**
 * @param req
 * @param res
 * @returns the updating name of product in retailer with product id and new name
 */
 const updateProductName:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newname"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newname)
            const contract = await getProductContract();

            console.log(`Update name of product namely: product id ${key1}, new name ${key2} in Retailer Unit`)
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

// PUT /retailer/product/category with body request {"retailer":"","productID":"","newCategory":""}
/**
 * @param req
 * @param res
 * @returns updating the category of product from retailer with product id and new category
 */
 const updateProductCategory:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newCategory"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newCategory)
            const contract = await getProductContract();

            console.log(`Update category of product namely: product id ${key1}, new category ${key2} in Retailer Unit`)
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

// PUT /retailer/products/origin with body request {"retailer":"","productID":"","newOrigin":""}
/**
 * @param req
 * @param res
 * @returns updating the origin of product from retailer with product id and new origin
 */
 const updateProductOrigin:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newOrigin"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newOrigin)
            const contract = await getProductContract();
            
            console.log(`Update origin of product namely: product id ${key1}, new origin ${key2} in Retailer Unit`)
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

// PUT /retailer/products/unitprice with body request {"retailer":"","productID":"","newUnitPrice":""}
/**
 * @param req
 * @param res
 * @returns updating the unit price of product from retailer with product id and new unit price
 */
 const updateProductUnitPrice:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newUnitPrice"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newUnitPrice)
            const contract = await getProductContract();

            console.log(`Update unit price of product namely: product id ${key1}, new unit price ${key2} in Retailer Unit`)
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

// PUT /retailer/products/unitmeasurement with body request {"retailer":"","productID":"","newUnitMeasurement":""}
/**
 * @param req
 * @param res
 * @returns updating product unit of measurement from retailer with product id and new unit of measurement
 */
 const updateProductUnitMeasurement:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newUnitMeasurement"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newUnitMeasurement)
            const contract = await getProductContract();

            console.log(`Update unit measurement of product namely: product id ${key1}, new unit measurement ${key2} in Retailer Unit`)
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

// PUT /retailer/products/quantity with body request {"retailer":"","productID":"","newQuantity":""}
/**
 * @param req
 * @param res
 * @returns updating the quantity of product from retailer with product id and new quantity
 */
 const updateProductQuantity:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newQuantity"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newQuantity)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new quantity ${key2} in Retailer Unit`)
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

// PUT /retailer/products/newImageSrc with body request {"retailer":"","productID":"","newImageSrc":""}
/**
 * @param req
 * @param res
 * @description updating the quantity of product from retailer with product id and new image source
 */
 const updateProductImageSource:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","productID","newImageSrc"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productID)
            var key2 =String(req.body.newImageSrc)
            const contract = await getProductContract();

            console.log(`Update quantity of product namely: product id ${key1}, new image source ${key2} in Retailer`)
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

// PUT /retailer/productBatch/location with body request {"retailer":"","productBatchID":"","newLocation":""}
/**
 * @param req
 * @param res
 * @returns the location entry information of retailer with product batch id and new location
 */
 const updateProductBatchLocation:any|Response = async (req: Request, res: Response) => {
    var format1= ["retailer","batchID","newLocation"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productBatchID)
            var key2 =String(req.body.newLocation)
            const contract = await getProductBatchContract();

            console.log(`Update location of product batch namely: product batch id ${key1}, new location ${key2} in Retailer Unit`)
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

// DELETE /retailer/products with body request {"product":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product with specific ID in retailer unit
 */
 const deleteProduct:any|Response =  async (req: Request, res: Response) => {
    var format1= ["productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key =String(req.body.productBatch)
            const contract = await getProductContract();
    
            console.log(`Delete the product batch ${key} in Retailer Unit `)
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
    readProduct, readProductBatch, getProductHistory, getBatchHistory, queryAllAvailableProducts,
    getProductsByRange,

    updateProduct, updateProductName, updateProductCategory, updateProductOrigin,
    updateProductUnitPrice, updateProductUnitMeasurement, updateProductQuantity,
    updateProductBatchLocation, updateProductImageSource,

    deleteProductBatch, deleteProduct,
}