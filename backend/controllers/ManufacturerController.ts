/**
 * @Controller manufacturer
 */
 import express from "express"
 const router = express.Router()
 const ManufacturerMiddleware = require('../middleware/ManufacturerMiddleware');
 const RenderMiddleware = require('../middleware/RenderMiddleware');
 const AuthMiddleware = require('../middleware/AuthMiddleware');
 
 /// GET METHOD
 // *** prerequisite router for manufacturer role ***
 router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer, RenderMiddleware.manufacturerPage);
 router.get('/delivery', RenderMiddleware.manufacturerDeliveryPage);
 
 // ** Using function to describe manufacturer's capacity **

 // * Using this function without support from query string
 // ** routing to starting endpoint at product
router.get("/product/:productID", ManufacturerMiddleware.productExists);
router.get("/product/history/:productID", ManufacturerMiddleware.getProductHistory);
router.get("/product/:productID", ManufacturerMiddleware.readProduct);
router.get("/product/start/:startID/end/:endID", ManufacturerMiddleware.getProductsByRange);
// router.get("/product/category", ManufacturerMiddleware.getBatchByCategory);
// ** routing to starting endpoint at batch
router.get("/product/:batchID", ManufacturerMiddleware.batchExists);
router.get("/productBatch/history/:batchID", ManufacturerMiddleware.getBatchHistory);
router.get("/productBatch/:batchID", ManufacturerMiddleware.readProductBatch);
router.get("/productBatch/start/:startID/end/:endID", ManufacturerMiddleware.getBatchByRange);
router.get("/productBatch/status", ManufacturerMiddleware.getBatchByStatus);
router.get("/productBatch/query/status", ManufacturerMiddleware.queryBatchesByStatus);


//* Using this function with support from query string(rich query e.g. CouchDB)
//** product */
router.get("/product/query/category", ManufacturerMiddleware.queryProductsByCategory);
router.get("/product/query/name", ManufacturerMiddleware.QueryProductsByName);
router.get("/product/query/products", ManufacturerMiddleware.queryProducts);
router.get("/product/query/products/all", ManufacturerMiddleware.queryAllProducts);
router.get("/product/query/products/all/available", ManufacturerMiddleware.queryAllAvailableProducts);
router.get("/product/query/products/all/unavailable", ManufacturerMiddleware.queryAllUnavailableProducts);
//** product batch*/
router.get("/productBatch/query/all", ManufacturerMiddleware.queryAllProductBatches);
router.get("/productBatch/query/all/available", ManufacturerMiddleware.queryAllUnavailableProducts);
router.get("/productBatch/query/all/unavailable", ManufacturerMiddleware.queryAllUnavailableProducts);



 /// POST METHOD
router.post("/product/mark/available", ManufacturerMiddleware.markAsAvailable);
router.post("/product/mark/unavailable", ManufacturerMiddleware.markAsUnavailable);
router.post("/productBatch/create", ManufacturerMiddleware.createProductBatch);
router.post("/product/create", ManufacturerMiddleware.createProduct);
router.post("/product/available/create", ManufacturerMiddleware.createProductAvailable);

/// PUT METHOD
// ** routing to starting endpoint at product
router.put("/product/update", ManufacturerMiddleware.updateProduct);
router.put("/product/name/:productID/update", ManufacturerMiddleware.updateProductName);
router.put("/product/category/:productID/update", ManufacturerMiddleware.updateProductCategory);
router.put("/product/origin/:productID/update", ManufacturerMiddleware.updateProductOrigin);
router.put("/product/unitprice/:productID/update", ManufacturerMiddleware.updateProductUnitPrice);
router.put("/product/unitmeasurement/:productID/update", ManufacturerMiddleware.updateProductUnitMeasurement);
router.put("/product/quantity/:productID/update", ManufacturerMiddleware.updateProductQuantity);
router.put("/product/productionDate/:productID/update", ManufacturerMiddleware.updateProductionDate);
router.put("/product/expirationDate/:productID/update", ManufacturerMiddleware.updateExpirationDate);
router.put("/product/imagesource/:productID/update", ManufacturerMiddleware.updateProductImageSource);
// ** routing to starting endpoint at productBatch
router.put("/productBatch/product/:productID/productBatch/:batchID/quantity-update", ManufacturerMiddleware.updateProductBatch);
router.put("/productBatch/location/:batchID/update", ManufacturerMiddleware.updateProductBatchLocation);
router.put("/productBatch/destination/:batchID/update", ManufacturerMiddleware.updateProductBatchDestination);
router.put("/productBatch/:batchID/distributor/:newDistributorID/update", ManufacturerMiddleware.updateProductBatchDistributor);
router.put("/productBatch/:batchID/retailer/:newRetailerID/update", ManufacturerMiddleware.updateProductBatchRetailer);

// ** sort
router.put("/productBatch/:batchID/sort", ManufacturerMiddleware.sortProductBatch);

// ** delivery
router.put("/delivery", ManufacturerMiddleware.deliverBatchToDistributor);
router.put("/productBatch/:batchID/deliver-retailer", ManufacturerMiddleware.deliverBatchToRetailer);
router.put("/productBatch/:batchID/deliver-distributor", ManufacturerMiddleware.deliverBatchToDistributor);

/// DELETE METHOD
router.delete("/product/:productID/delete", ManufacturerMiddleware.deleteProduct);
router.delete("/productBatch/:productBatchID/delete", ManufacturerMiddleware.deleteProductBatch);
router.delete("/productBatch/:batchID/product/:productID/delete", ManufacturerMiddleware.deleteProductFromBatch);

 module.exports = router