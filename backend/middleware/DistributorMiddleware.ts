import { type Request, Response } from 'express';
const securityModule=require("../helpers/secur_util")
const { getProductBatchContract, disconnetGateway } = require('../utils/distributor_utils')

import { TextDecoder } from 'util';
let utf8decoder = new TextDecoder();

// GET /distributor/productBatch with query request ?batchID=value
/**
 * @param req
 * @param res
 * @returns product batch information of the distributor
 */
 const batchExists = async (req: Request, res: Response) => {
    let batchID = String(req.query.batchID);
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

// GET /distributor/products with query request ?category=catergory
/**
 * @param req
 * @param res
 * @returns product batch information of the distributor by giving category
 */
 const getBatchByCategory = async (req: Request, res: Response) => {
  let category = String(req.query.category);
  try {
      const contract = await getProductBatchContract();
      console.log(`GET information of product batch by giving category: ${category}`);
      const result = await contract.evaluateTransaction('GetBatchByCategory', category);
      res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
  } catch (error) {
      console.log('error of fetching this api, please look at the api stuff: ' + error);
      res.status(500).send(error);
  } finally {
      disconnetGateway();
  }
}

// GET /distributor/productBatch/range with query request ?name=name
/**
 * @param req
 * @param res
 * @description get all product batch information of the distributor by giving range
 * @returns product batch information of the distributor by giving range
 */
const getBatchByRange = async (req: Request, res: Response) => {
    let startID = String(req.body.startID);
    let endID = String(req.body.endID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch by giving range: ${startID} to ${endID}`);
        const result = await contract.evaluateTransaction('GetBatchesByRange', startID, endID);
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /distributor/productBatch/status with query request ?status=status
/**
 * @description using this function with the support rich query from database
 * @param req
 * @param res
 * @returns product batch information of the distributor by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
 const getBatchByStatus = async (req: Request, res: Response) => {
    let status = String(req.query.status);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from distributor by giving status: ${status}`);
        const result = await contract.evaluateTransaction('GetBatchesByStatus', status);
        res.status(200).send(result);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /distributor/productBatch/status with query request ?productID=value 
/**
 * @description this function has the alias for the function above
 * @param req
 * @param res
 * @returns product batch information of the distributor by giving status
 * @returns status: 0: created, 1: in process, 2: finished
 */
 const queryBatchesByStatus = async (req: Request, res: Response) => {
    let productID = String(req.query.productID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET information of product batch from distributor by giving productID: ${productID}`);
        const result = await contract.evaluateTransaction('QueryBatchesByStatus', productID);
        res.status(200).send(result);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}

// GET /distributor/productBatch/all
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

// GET /distributor/productBatch/history with query request ?batchID=value
/**
 * 
 * @param req 
 * @param res 
 * @returns All product batch of the distributor
 */
 const getBatchHistory = async (req: Request, res: Response) => {
    let batchID = String(req.query.batchID);
    try {
        const contract = await getProductBatchContract();
        console.log(`GET all product batch with batch ID ${batchID} from distributor`);
        const result = await contract.evaluateTransaction('GetBatchHistory', batchID);
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())));
    } catch (error) {
        res.status(500).send(error);
    } finally {
        disconnetGateway();
    }
}



// GET /retailer/productBatch/:batchID
/**
 * 
 * @param req 
 * @param res 
 * @returns information of product batch
 */
 const readProductBatch: any|Response = async (req: Request, res: Response) => {
  let productBatchID = String(req.params.productBatchID);
  if(securityModule.checkspecialchar(productBatchID)) {
      try {
          const contract = await getProductBatchContract();
          console.log(`GET a product batch with ID ${productBatchID} from distributor`)
          let data = await contract.evaluateTransaction('ReadProductBatch',productBatchID)
          res.status(200).json(JSON.parse(utf8decoder.decode(data.toString())))
      } catch (error) {
          console.error("error: "+error);
          res.status(500).send(error)
      } finally {
          disconnetGateway();
      }
  }
  else return res.status(500).send("The ID provIDed contains special characters")
}


// PUT /distributor/productBatch/deliver with body request {"distributor":"","batchID":"","retailerID":"","location":""}
/**
 * @param req
 * @param res
 * @description deliver product batch from distributor to retailer unit
 */
 const deliverToRetailerUnit:any|Response = async (req: Request, res: Response) => {
  var format1= ["batchID","retailerID","location"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
      try {
          var key1 =String(req.body.batchID)
          var key2 =String(req.body.retailerID)
          var key3 =String(req.body.location)
          const contract = await getProductBatchContract();

          console.log(`Deliver product batch namely: product batch ID ${key1}, retailer ID ${key2}, location ${key3} in Distributor`)
          await contract.submitTransaction('SendBatchToRetailer', key1,key2,key3)
          res.sendStatus(200)
      } catch (err) {
          console.error("error: " + err)
          res.sendStatus(500)
      } finally {
          disconnetGateway();
      }
  } else return res.status(500).send("wrong format")
}

// PUT /distributor/products with body request {"distributor":"","batchID":"","productID":"","productionDate":""}
/**
 * @param req
 * @param res
 * @returns update product batch in the distributor with specific ID
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
    
            console.log(`Update information of product batch namely batch ID: ${key1}, product ID: ${key2}, quantity: ${key3} in distributor`)
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

// PUT /distributor/productBatch/location with body request {"distributor":"","productBatchID":"","newLocation":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of distributor with product batch ID and new location
 */
 const updateProductBatchLocation:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newLocation"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newLocation)
            const contract = await getProductBatchContract();

            console.log(`Update current location of product batch namely: product batch ID ${key1}, new location ${key2} in distributor`)
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

// PUT /distributor/productBatch/destination with body request {"distributor":"","productBatchID":"","newDestination":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of distributor with product batch ID and new destination
 */
 const updateProductBatchDestination:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newDestination"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newDestination)
            const contract = await getProductBatchContract();

            console.log(`Update current location of product batch namely: product batch ID ${key1}, new destination ${key2} in distributor`)
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

// PUT /distributor/productBatch/:batchID/distributor/:distributorID with body request {"distributor":"","batchID":"","newDistributorID":""}
/**
 * @param req
 * @param res
 * @description updating the distributor ID of product batch from distributor with product batch ID and new distributor ID
 */
 const updateProductBatchDistributor:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newDistributorID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newDistributorID)
            const contract = await getProductBatchContract();

            console.log(`Update distributor ID of product batch namely: product batch ID ${key1}, new distributor ID ${key2} in distributor`)
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

// PUT /distributor/productBatch/:batchID/retailer/:retailerID with body request {"distributor":"","batchID":"","newRetailerID":""}
/**
 * @param req
 * @param res
 * @description updating the retailer ID of product batch from distributor with product batch ID and new retailer ID
 */
 const updateProductBatchRetailer:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID","newRetailerID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            var key2 =String(req.body.newRetailerID)
            const contract = await getProductBatchContract();

            console.log(`Update retailer ID of product batch namely: product batch ID ${key1}, new retailer ID ${key2} in distributor`)
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

// POST /distributor/productBatch/:batchID/sort with body request {"distributor":"","batchID":"","location":""}
/**
 * @param req
 * @param res
 * @description sort product batch from distributor
 * @returns sorted product batch
 */
 const sortProductBatch = async (req: Request, res: Response) => {
    try {
        var key1 =String(req.body.batchID)
        const contract = await getProductBatchContract();

        console.log(`Sort product batch namely: product batch ID ${key1} in distributor`)
        const result = await contract.submitTransaction('SortBatchProducts', key1)
        res.status(200).send(JSON.parse(utf8decoder.decode(result.toString())))
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
        disconnetGateway();
    }
}

//DELETE /distributor/products with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @returns delete a product batch with specific ID in distributor
 */
 const deleteProductBatch:any|Response =  async (req: Request, res: Response) => {
  var format1= ["productBatchID"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
      try {
          var key =String(req.body.productBatchID)
          const contract = await getProductBatchContract();
  
          console.log(`Delete the product batch ${key} in distributor `)
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

// DELETE /distributor/productBatch/:batchID/product/:productID with body request {"productBatch":"value"}
/**
 * @param req
 * @param res
 * @description delete a product from product batch with specific ID in distributor
 */
 const deleteProductFromBatch:any|Response =  async (req: Request, res: Response) => {
    var format1= ["productBatchID","productID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.productBatchID)
            var key2 =String(req.body.productID)
            const contract = await getProductBatchContract();

            console.log(`Delete the product ${key2} from product batch ${key1} in distributor `)
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
// PUT /distributor/productBatch/:batchID/mark-delivered with body request {"batchID":""}
/**
 * @param req
 * @param res
 * @description deliver product batch from distributor to retailer unit
 */
 const markBatchAsDelivered:any|Response = async (req: Request, res: Response) => {
    var format1= ["batchID"]
    if(securityModule.JSONvalidator(req.body,format1.length,format1)){
        try {
            var key1 =String(req.body.batchID)
            const contract = await getProductBatchContract();
  
            console.log(`Marking product batch ${key1} as delivered`)
            await contract.submitTransaction('MarkBatchAsDelivered', key1)
            res.sendStatus(201)
        } catch (err) {
            console.error("error: " + err)
            res.sendStatus(400)
        } finally {
            disconnetGateway();
        }
    } else return res.status(400).send("wrong format")
}

module.exports = {
    batchExists, getBatchByCategory, readProductBatch, getBatchByRange,
    getBatchByStatus, queryBatchesByStatus, queryAllProductBatches, getBatchHistory,

    deliverToRetailerUnit, updateProductBatch, updateProductBatchDestination,
    updateProductBatchLocation, updateProductBatchDistributor,
    updateProductBatchRetailer, sortProductBatch, markBatchAsDelivered,

    deleteProductBatch, deleteProductFromBatch
}