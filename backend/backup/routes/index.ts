import express, { Express } from 'express';

//Controllers
const AuthController = require("../controllers/AuthController");
const TestController = require('../controllers/TestController');
const DistributorController = require("../controllers/DistributorController");
const RetailerUnitController = require("../controllers/RetailerunitController");
const ManufacturerController=require("../controllers/ManufacturerController");
const UserController = require('../controllers/UserController')

//Init ledger
const { createContract, disconnetGateway} = require('../helpers/web_util');

//Hyperledger Fabric library import
import path from 'path';
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");

//Helper function
const { buildWallet, buildCCPOrg } = require("../helpers/AppUtil");
const { buildCAClient, enrollAdmin, registerAndEnrollUser } = require("../helpers/CAUtil");
const { serverRoot } = require("../helpers/pathUtil");

//This function to apply the controller to the application webserver
const initApp = (app:Express) => {
    app.use("/auth",  AuthController)
    app.use("/manufacturer", ManufacturerController);
    app.use("/distributor", DistributorController);
    app.use("/retailer-unit", RetailerUnitController);
    app.use("/user", UserController)

    //This route is used for testing purpose only
    app.use('/test', TestController)
}

//This function to initialize some mock data for development purposes
const initLedger = async (app:Express) => {
    try {
        const contract = await createContract();
        await contract.submitTransaction('InitProductBatch');
        await contract.submitTransaction('InitProduct');
        
    } catch (err) {
        console.error("error: " + err)
    } finally {
        disconnetGateway();
    }
}


const initAdminAccounts = async () => {
    await initManufacturerAccount();
    await initDistributorAccount();
    await initRetailerAccount();
}

const initManufacturerAccount = async () => {
    //Configuration for manufacturer organization
    const manufacturerHostname = "ca.Manufacturer.example.com";
    const mspOrg = 'ManufacturerMSP';
    const userId = "ngocnguyen";
    const affiliation = "manufacturer.department1";
    const walletManufacturer = path.resolve(serverRoot, "wallet");
    const ccpOrg = 'manufacturer'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(manufacturerHostname, walletManufacturer, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation)
}

const initDistributorAccount = async () => {
    //Configuration for distributor organization
    const distributorHostname = "ca.Distributor.example.com";
    const mspOrg = 'DistributorMSP';
    const userId = "ngocnguyen";
    const affiliation = "distributor.department1";
    const walletDistributor = path.resolve(serverRoot, "walletDistributor");
    const ccpOrg = 'distributor'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(distributorHostname, walletDistributor, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation)
}

const initRetailerAccount = async () => {
    //Configuration for productunit organization
    const RetailerUnitHostname = "ca.Retailerunit.example.com";
    const mspOrg = 'RetailerunitMSP';
    const userId = "ngocnguyen";
    const affiliation = "retailerunit.department1";
    const walletMedic = path.resolve(serverRoot, "walletMedic");
    const ccpOrg = 'medicalunit'

    //Get the CA-client and wallet
    const {caClient, wallet} = await initAdmins(RetailerUnitHostname, walletMedic, ccpOrg)
    
    //Enroll the admin identity
    await enrollAdmin(caClient, wallet, mspOrg);

    //Enroll user
    await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation);

}
/**
 * Helper functions to init the admin accounts of different organizations
 */
const initAdmins = async (caHostname:string, walletPath:string, ccpOrg:any) => {
    const ccp = buildCCPOrg(ccpOrg);
    const caClient = buildCAClient(FabricCAServices, ccp, caHostname);
    const wallet = await buildWallet(Wallets, walletPath);
    return {
        caClient,
        wallet
    }
}

module.exports = {
    initApp,
    initLedger,
    initAdminAccounts
};