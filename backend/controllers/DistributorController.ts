/**
 * @Controller Distributor
 */
import express from "express"
const router = express.Router()
const DistributorMiddleware = require('../middleware/DistributorMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');
const AuthMiddleware = require('../middleware/AuthMiddleware');

 /// GET METHOD
 // *** prerequisite router for distributor role ***
router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isDistributor,RenderMiddleware.distributorPage);
router.get('/delivery', RenderMiddleware.distributorDeliveryPage);

// ** Using function to describe distributor's capacity **
router.get("/product/:batchID", DistributorMiddleware.batchExists);
router.get("/productBatch/history", DistributorMiddleware.getBatchHistory);
router.get("/productBatch/:batchID", DistributorMiddleware.readProductBatch);
router.get("/productBatch/start/:startID/end/:endID", DistributorMiddleware.getBatchByRange);
router.get("/productBatch/status", DistributorMiddleware.getBatchByStatus);
router.get("/productBatch/query/status", DistributorMiddleware.queryBatchesByStatus);
router.get("/productBatch/query/all", DistributorMiddleware.queryAllProductBatches);


 /// PUT METHOD
router.put("/productBatch/location/:batchID/update", DistributorMiddleware.updateProductBatchLocation);
router.put("/productBatch/destination/:batchID/update", DistributorMiddleware.updateProductBatchDestination);// all 3 roles can call 
router.put("/productBatch/:batchID/distributor/:newDistributorID/update", DistributorMiddleware.updateProductBatchDistributor);
router.put("/productBatch/:batchID/retailer/:newRetailerID/update", DistributorMiddleware.updateProductBatchRetailer);
router.put("/productBatch/:batchID/mark-delivered", DistributorMiddleware.markBatchAsDelivered);
// ** delivery
router.put("/delivery", DistributorMiddleware.deliverToRetailerUnit)


router.put("/productBatch/:batchID/sort", DistributorMiddleware.sortProductBatch);

 /// DELETE METHOD
 router.delete("/productBatch/:productBatchID/delete", DistributorMiddleware.deleteProductBatch);
 router.delete("/productBatch/:batchID/product/:productID/delete", DistributorMiddleware.deleteProductFromBatch);
 
module.exports = router