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
router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isRetailerUnit,RenderMiddleware.retailerUnitPage);
router.get('/delivery', RenderMiddleware.distributorDeliveryPage);

// ** Using function to describe retailer's capacity **

// * Using this function without support from query string
router.get("/productBatch/history", RetailerunitMiddleware.getBatchHistory);
router.get("/product/history", RetailerunitMiddleware.getProductHistory);
router.get("/product/:productID", RetailerunitMiddleware.readProduct);
router.get("/productBatch/:batchID", RetailerunitMiddleware.readProductBatch);
router.get("/product/range", RetailerunitMiddleware.getProductsByRange);

//* Using this function with support from query string(rich query e.g. CouchDB)
router.get("/product/all/available", RetailerunitMiddleware.queryAllAvailableProducts);

 /// PUT METHOD
// ** routing to starting endpoint at product
router.put("/product/update", RetailerunitMiddleware.updateProduct);
router.put("/product/name/:productID/update", RetailerunitMiddleware.updateProductName);
router.put("/product/category/:productID/update", RetailerunitMiddleware.updateProductCategory);
router.put("/product/origin/:productID/update", RetailerunitMiddleware.updateProductOrigin);
router.put("/product/unitprice/:productID/update", RetailerunitMiddleware.updateProductUnitPrice);
router.put("/product/unitmeasurement/:productID/update", RetailerunitMiddleware.updateProductUnitMeasurement);
router.put("/product/quantity/:productID/update", RetailerunitMiddleware.updateProductQuantity);
router.put("/product/imagesource/:productID/update", RetailerunitMiddleware.updateProductImageSource);
// ** routing to starting endpoint at productBatch
router.put("/productBatch/location/:batchID/update", RetailerunitMiddleware.updateProductBatchLocation);

 /// DELETE METHOD
router.delete("/product/:productID/delete", RetailerunitMiddleware.deleteProduct);
router.delete("/productBatch/:productBatchID/delete", RetailerunitMiddleware.deleteProductBatch);
module.exports = router