/**
 * @Controller retailer
 */
import express from "express"
const router = express.Router()
const RetailerunitMiddleware = require('../middleware/RetailerunitMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');
const AuthMiddleware = require('../middleware/AuthMiddleware');

 /// GET METHOD
 // *** prerequisite router for retailer unit role ***
router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isRetailer,RenderMiddleware.retailerUnitPage);

// ** Using function to describe retailer's capacity **

// * Using this function without support from query string
router.get("/productBatch/history", RetailerunitMiddleware.getBatchHistory);
router.get("/product/history", RetailerunitMiddleware.getProductHistory);
router.get("/product/:productID", RetailerunitMiddleware.readProduct);
router.get("/productBatch/:batchID", RetailerunitMiddleware.readProductBatch);
router.get("/product/range", RetailerunitMiddleware.getProductsByRange);

//* Using this function with support from query string(rich query e.g. CouchDB)
router.get("/product/all/available", RetailerunitMiddleware.queryAllAvailableProducts);
router.post("/product/purchase", RetailerunitMiddleware.purchaseProduct);

 /// PUT METHOD
// ** routing to starting endpoint at product
router.put("/productBatch/:batchID/sort", RetailerunitMiddleware.sortProductBatch);
router.get("/productBatch/query/all", RetailerunitMiddleware.queryAllProductBatches);
router.put("/productBatch/add-product", RetailerunitMiddleware.addProductsToBatch)
// ** routing to starting endpoint at productBatch

 /// DELETE METHOD
router.delete("/productBatch/:productBatchID/delete", RetailerunitMiddleware.deleteProductBatch);
router.delete("/productBatch/:batchID/product/:productID/delete", RetailerunitMiddleware.deleteProductFromBatch);
module.exports = router