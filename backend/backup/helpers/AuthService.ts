//Global import
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
import path from 'path';

//File path resolving 
const { serverRoot } = require("./pathUtil");
const { buildCCPOrg } = require('./AppUtil');
const caPath = path.join(serverRoot,  'helpers', 'CAUtil.ts');
const appPath = path.join(serverRoot,  'helpers', 'AppUtil.ts');
const walletPath = path.join(serverRoot, 'wallet');

//Import helpers
const { buildCAClient } = require(caPath);
const { buildCCPOrg1, buildWallet } = require(appPath);



const connectToCA = async (caHostName:string) => {
    const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    return {
        caClient: caClient,
        ccp: ccp,
        wallet: wallet,
    };
}

const getMaterials = async (caHostName:string, walletPath:string, ccpOrg:string) => {
    const ccp = buildCCPOrg(ccpOrg);
    const wallet = await buildWallet(Wallets, walletPath);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

    return {
        caClient,
        wallet,
    }
}

module.exports = {
    connectToCA,
    getMaterials
};