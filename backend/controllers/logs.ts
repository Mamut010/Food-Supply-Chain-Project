import express, { type Request, Response} from 'express';
const router = express.Router();
const { getContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/web_utils.ts')

/**
 * @param req
 * @param res
 * @returns json array
 */
router.get('/manufacturer', async function (req: Request, res: Response){
    try {
        const contract = await getContract();
        let logs = await contract.evaluateTransaction('GetDispatchLogs');
        res.json(JSON.parse(logs.toString()));
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})  


/**
 * @param req
 * @param res
 * @returns json array
 */
router.get('/distributor', async function (req: Request, res: Response) {
    try {
        const contract = await getContract();
        let logs = await contract.evaluateTransaction('GetDeliveryLogs');
        res.json(JSON.parse(logs.toString()));
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})

module.exports = router