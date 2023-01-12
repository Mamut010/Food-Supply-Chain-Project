import { type Request, Response } from 'express';
const securityModule=require("../helpers/secur_util")
const { getProductBatchContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/distributor_utils')

// GET /distributor/productBatch with query request ?batchID=value
/**
 * @param req
 * @param res
 * @returns product batch information of the distributor
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

// GET /distributor/products with query request ?category=catergory
/**
 * @param req
 * @param res
 * @returns product batch information of the distributor by giving category
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

// GET /retailer/productBatch/:batchID
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


// PUT /distributor/productBatch/deliver with body request {"manufacturer":"","batchID":"","retailerID":"","location":""}
/**
 * @param req
 * @param res
 * @description deliver product batch from distributor to retailer unit
 */
 const deliverToRetailerUnit:any|Response = async (req: Request, res: Response) => {
  var format1= ["distributor","batchID","retailerID","location"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
      try {
          var key1 =JSON.stringify(req.body.batchID)
          var key2 =JSON.stringify(req.body.retailerID)
          var key3 =JSON.stringify(req.body.location)
          const contract = await getProductBatchContract();

          console.log(`Deliver product batch namely: product batch id ${key1}, retailer id ${key2}, location ${key3} in Distributor`)
          await contract.submitTransaction('SendBatchToRetailer', key1,key2,key3)
          res.sendStatus(200)
      } catch (err) {
          console.error("error: " + err)
          res.sendStatus(500)
      } finally {
          disconnetGateway();
      }
  } else return res.send("wrong format")
}

// PUT /distributor/batchID with body request {"batchID":"value", "newDistributorID":"value"}
/**
 * @param req
 * @param res
 * @returns updating the product batch of distributor with specific ID
 */
const updateDistributorID:any|Response = async (req: Request, res: Response) => {
  var format1 =["distributor","batchID","newDistributorID"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
    try {
      let key1 = JSON.stringify(req.body.batchID)
      let key2 = JSON.stringify(req.body.newDistributorID)
      const contract = await getProductBatchContract();

      console.log(`Updating the product batch of distributor with id ${key1} to ${key2}`)
      await contract.submitTransaction('UpdateDistributorID', key1, key2)
      res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
      disconnetGateway();
    }
  } else return res.send("The JSON provided is not valid")
}

// PUT /distributor/products with body request {"productBatch":"value","name":"value","quantity":"value","productionDate":"value"}
/**
 * @
 * @returns update a product batch in distributor with specific ID
 */
const updateProductBatch=async  (req: Request, res: Response)=> {
    try {
      var key1 =JSON.stringify(req.body.productBatch)
      var key2 =JSON.stringify(req.body.name)
      var key3 =JSON.stringify(req.body.quantity)
      var bool = /^\d+$/.test(key3);
      if (bool){
        if(parseInt(key3)>10000){key3="10000"}
      } 
      if (!bool){key3="10000"}
      var key4 =JSON.stringify(req.body.productionDate)
      const contract = await getProductBatchContract();
      console.log(`Update information of product batch ${key1} in distributor `)
      await contract.submitTransaction('AddProductsToBatch', key1,key2,key3,key4) 
      res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
      disconnetGateway();
    }
  
}

// PUT /retailer/productBatch/location with body request {"retailer":"","productBatchID":"","newLocation":""}
/**
 * @param req
 * @param res
 * @desciption the location entry information of manufacturer with product batch id and new location
 */
 const updateProductBatchLocation:any|Response = async (req: Request, res: Response) => {
  var format1= ["retailer","batchID","newLocation"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
      try {
          var key1 =String(req.body.productBatchID)
          var key2 =String(req.body.newLocation)
          const contract = await getProductBatchContract();

          console.log(`Update location of product batch namely: product batch id ${key1}, new location ${key2} in retailer unit`)
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

module.exports = {
    batchExists, getBatchByCategory, readProductBatch,

    deliverToRetailerUnit, updateProductBatch,
    updateProductBatchLocation, updateDistributorID,

    deleteProductBatch
}