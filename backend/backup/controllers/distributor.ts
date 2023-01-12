import express from "express"
const router = express.Router()
const securityModule = require("../helpers/secur_util")
const { createContract, disconnetGateway } = require('../helpers/web_util')

/**
 * @
 * @returns all product batches from distributor
 */
router.get("/products", async function (req, res) {
  try {
      const contract = await createContract();
      console.log(`GET all product batches from distributor`)
      let data = await contract.evaluateTransaction('GetDistributorLots') 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})

/**
 * @
 * @returns a product batch with given ID from distributor
 */
router.get("/products/:productID", async function (req, res) {
  let key=req.params.productID
  if(securityModule.hasSpecChar(key)){
    try {
      const contract = await createContract();
      console.log(`GET a product batch with id ${key} from distributor`)
      let data = await contract.evaluateTransaction('GetDistributorLot', key) 
      res.status(200).json(JSON.parse(data.toString()))
    } catch (err) {
        console.error("error: " + err)
        res.send(500)
    } finally {
      disconnetGateway();
    }
  }
  else return res.send("The ID provided contains special characters")
})


// PUT /distributor/delivery with body request {"productBatch":"value"}
/**
 * @
 * @returns deliver product batch with given ID to retailer unit
 */
router.put("/delivery", async function (req, res) {
  var format1= ["productBatch"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
    try {
      var key = String(req.body.productBatch)
      const contract = await createContract();
      console.log(`Deliver product batch with id ${key} to product unit `)
      await contract.submitTransaction('DeliverToRetailerUnit', key) 
      res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
      disconnetGateway();
    }
  }
  else return res.send("wrong format")
  
})


/**
 * @
 * @returns all product batch that HAS BEEN, at some interval of time, under DISTRIBUTOR
 */
router.get("/logs", async function (req, res) {
  try {
      let dummyVal="dummy"
      const contract = await createContract();

      console.log(`GET all distributor's delivery logs`)
      let data = await contract.evaluateTransaction('GetDeliveryLogsOf',dummyVal,"distributor") 
      res.status(200).json(JSON.parse(data.toString()))
      
  } catch (err) {
      console.error("error: " + err)
      res.send(500)
  } finally {
    disconnetGateway();
  }
})

// PUT /distributor/products with body request {"productBatch":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
/**
 * @
 * @returns update a product batch in distributor with specific ID
 */
router.put("/products", async function (req, res) {
  var format1 = ["productBatch","name","quantity","dateOfManufacture"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
    try {
      var key1 = String(req.body.productBatch)
      var key2 = String(req.body.name)
      var key3 = String(req.body.quantity)
      var key4 = String(req.body.dateOfManufacture)
      const contract = await createContract();
      console.log(`Update information of product batch ${key1} in distributor `)
      await contract.submitTransaction('UpdateDistributorLot', key1,key2,key3,key4) 
      res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
      disconnetGateway();
    }
  }
  else return res.send("wrong format")
  
})
//DELETE /distributor/products with body request {"productBatch":"value"}
/**
 * @
 * @returns delete a product batch with specific ID in distributor
 */
router.delete("/products", async function (req, res) {
  var format1= ["productBatch"]
  if(securityModule.JSONvalidator(req.body,format1.length,format1)){
    try {
      var key = String(req.body.productBatch)
      const contract = await createContract();
      console.log(`Delete the product batch ${key} in distributor `)
      await contract.submitTransaction('DeleteDistributorLot', key) 
      res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
      disconnetGateway();
    }
  }
  else return res.send("wrong format")
  
})

module.exports = router