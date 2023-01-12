import express, { type Request, Response } from 'express';
import { Wallet } from 'fabric-network';
import path from 'path';
import { buildWallet } from '../helpers/AppUtil';
const { serverRoot } = require ('../helpers/pathUtil');
const { createContract, disconnetGateway } = require('../helpers/web_util')
const RenderMiddleware = require('../middleware/RenderMiddleware')
const securityModule = require('../helpers/secur_util')

/**
 * @
 * @description this is the rendering secton of the retailerunit page
 * @returns all rendered page of retailer unit page
 */
router.get('/', RenderMiddleware.retailerUnitPage);
router.get('/delivery', RenderMiddleware.retailerUnitDeliveryPage);

/**
 * @
 * @description returns all of the available users of the retailer unit
 * @returns all users with status code = 200
 */
router.get('/users', async(req: Request, res: Response) => {
    const walletPath:string = path.resolve(serverRoot, 'walletProduct');
    const wallet = await buildWallet(walletPath);
    
})
