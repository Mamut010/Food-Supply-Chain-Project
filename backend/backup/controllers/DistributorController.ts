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
router.get("/productBatch/:category", DistributorMiddleware.getBatchByCategory)
router.get("/logs", DistributorMiddleware.readProductBatch)

 /// PUT METHOD
router.put("/productBatch/location/:batchID/update", DistributorMiddleware.updateProductBatchLocation)
router.put("/productBatch/:batchID/update", DistributorMiddleware.updateProductBatch)
router.put("/productBatch/:batchID/distributor/:distributorID/update", DistributorMiddleware.updateDistributorID)
// ** delivery
router.put("/delivery", DistributorMiddleware.deliverToRetailerUnit)

 /// DELETE METHOD
router.delete("/products", DistributorMiddleware.deleteProductBatch)
module.exports = router