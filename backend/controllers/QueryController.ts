import express, { type Request, Response} from 'express';
const router = express.Router();
//const { createContract, disconnectGateway } = require('../helpers/web_util');
const { getContract, disconnetGateway } = require('../../chaincode/admin-chaincode/application-gateway-typescript-hamburgproject/src/web_utils.ts')

// Warning: <<<<<<<<<<<<<<<< Temp file dont read!!!!!!! >>>>>>>>>>>>>>>>>>>>>
/**
 * @param req
 * @param res
 * @returns a range query based on the start and end IDs provided.
 */
router.post('/manufacturer/range', async function (req: Request, res: Response){
    try {
        const contract = await getContract();
        let key1 = req.query.startID;
        let key2 = req.query.endID;
        console.log(`this GetProductsByRange function performs a range query based on the range from ${key1} to ${key2} provided.`)
        let logs = await contract.evaluateTransaction('GetProductsByRange',key1,key2);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
})

/**
 * @param req
 * @param res
 * @returns a range query based on the category provided
 */
router.post('/manufacturer/category', async function (req: Request, res: Response){
    try {
        const contract = await getContract();
        let key1 = req.query.category;
        console.log(`this GetProductsByCategory function performs a range query based on the category: ${key1} provided.`)
        let logs = await contract.evaluateTransaction('GetProductsByCategory',key1);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
})

/**
 * @param req
 * @param res
 * @returns queries for products based on their names.
 */
 router.post('/manufacturer/name', async function (req: Request, res: Response){
    try {
        const contract = await getContract();
        let key1 = req.query.name;
        console.log(`this GetProductsByCategory function performs a range query based on the names: ${key1} provided.`)
        let logs = await contract.evaluateTransaction('QueryProductsByName',key1);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
})

/**
 * @param req
 * @param res
 * @returns queries for products based on their names.
 */
 router.post('/manufacturer/product/history', async function (req: Request, res: Response){
    try {
        const contract = await getContract();
        let key1 = req.query.productID;
        console.log(`this GetProductsByCategory function performs a range query based on the names: ${key1} provided.`)
        let logs = await contract.evaluateTransaction('GetProductHistory',key1);
    } catch (error) {
        console.log('error of fetching this api, please look at the api stuff: ' + error);
        res.send(500);
    } finally {
        disconnetGateway();
    }
})
