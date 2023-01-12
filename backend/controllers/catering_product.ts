import express, { type Request, Response} from 'express';
const router = express.Router();
const { getContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/web_utils.ts')

// PUT /vaccinate?vaccineID=<vaccineID>&userID=<userID>

/**
 * @param req
 * @param res
 * @returns Updated buffer vaccine object
 */
router.put("/product", async function (req: Request, res:Response) {
    let key1 = req.query.productID;
    let key2=req.query.newName;
    try {
        const contract = await getContract();
  
        console.log(`Update product ID ${key1} to product name of ${key2}`)
        await contract.submitTransaction('UpdateProductName', key1,key2) 
        res.sendStatus(200)
    } catch (err) {
        console.error("error: " + err)
        res.sendStatus(500)
    } finally {
        disconnetGateway();
    }
})
  
  // GET /vaccinate?id=<userID>
  
  /**
   * @param req
   * @param res
   * @returns vaccine state of a user with given userID
   */
router.get("/product/", async function (req: Request, res: Response) {
    let key1 = req.query.productID 
    let key2 = req.query.newName
    let key3 = req.query.newOrigin
    let key4 = req.query.newCategory
    let key5 = req.query.newUnitPrice
    let key6 = req.query.newUnitMeasurement
    let key7 = req.query.newQuantity
    try {
        const contract = await getContract();
  
        console.log(`GET product state of ${key1}, name of product ${key2}, new origin ${key3},
                        new category ${key4}, new unit of price ${key5}, new unit of measurement ${key6} and new quantity ${key7}`)
        let data = await contract.submitTransaction('UpdateProduct', key1,key2,key3,key4,key5,key6,key7) 
        res.status(200).json(JSON.parse(data.toString()))
        
    } catch (err) {
        console.error("error: " + err)
        res.send(500)
    } finally {
        disconnetGateway();
    }
})
  
  
module.exports = router