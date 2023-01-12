/**
 * This is the authentication middle, contains all function to authentication
 * and authorize the equivalent parties
 * 
 * @version beta
 */
//Types
import { type Request, Response, NextFunction } from 'express';
import { CustomError, instanceOfNodeError } from '../types/errors';

//Dependencies
const bcrypt = require("bcrypt");
import path from 'path'
const fs = require("fs");
const { Wallets } = require("fabric-network");
const { buildWallet } = require("../helpers/AppUtil");

//Helper functions
const AuthService = require("../helpers/AuthService");
const {registerAndEnrollUser} = require('../helpers/CAUtil');
const { serverRoot } = require("../helpers/pathUtil");

//Configuration
const salt = "$2b$10$J0HvW7R6cIMsagwfPPZ2JO";

const mspOrgs:any = {
    "manufacturer": "ManufacturerMSP",
    "distributor": "DistributorMSP",
    "retailerunit": "RetailerunitMSP",
}    

const caHostnameList:any = {
    "manufacturer": "ca.Manufacturer.example.com",
    "distributor": "ca.Distributor.example.com",
    "retailerunit": "ca.Retailerunit.example.com",
}

const walletFolder:any = {
    "manufacturer": "wallet",
    "distributor": "walletDistributor",
    "retailerunit": "walletRetailer",
}

const affiliationList:any = {
    "manufacturer": "manufacturer.department1",
    "distributor": "distributor.department1",
    "retailerunit": "retailerunit.department1",
}

const roleList = ["manufacturer", "distributor", "retailerunit"];

const signup = async (req: Request, res: Response) => {
    try{
        //Check if username and password are in correct form
        const {username, password, role} = req.body;
        if (!username && !password) {
            throw Error(`Please provide username and passsword!`);
        }
        if (!roleList) {
            throw Error("Please specify the signup role");
        }
        if (!roleList.includes(role)) {
            throw Error(`There is no ${role} role`);
        }
        //Get connection materials
        const caHostname = caHostnameList[role];
        const walletPath = path.resolve(serverRoot, walletFolder[role]);
        const { caClient, wallet } = await AuthService.getMaterials(caHostname, walletPath, role);

        const concatStr = username + password;
        const userId = await bcrypt.hashSync(concatStr, salt);

        //Find the available identites
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {	
        throw Error(`An identity for the user ${userId} already exists in the wallet`);
        }
        //Enroll new user

        const mspOrg = mspOrgs[role];
        const affiliation = affiliationList[role];
        await registerAndEnrollUser(caClient, wallet, mspOrg, userId, affiliation); 

        if (role === "retailerunit") {
            appendRetailerUser(userId);
        }
        req.userId = userId;
        res.json({
            message: `User ${userId} sign up successfully!`
        })
    }
    catch(err:any){
        console.trace("[ERROR]: " + err.stack);
        res.status(400).json({
            message: err.message
        })
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {username, password} = req.body;
        const concatStr = username + password;

        //Check the available user identity
        const userId = await bcrypt.hashSync(concatStr, salt);
        let { wallet, userRole } = await getRole(userId);
        if (!userRole && !wallet) {
            throw Error("Invalid username and password!");
        }

        if (userRole === "retailerunit") {
            const listPath = path.resolve(serverRoot, "walletRetailer", "userList.json");
            const rawList = fs.readFileSync(listPath);
            const userList = JSON.parse(rawList);
            if (userList.users.includes(userId)) {
                userRole = "user";
            }
        }

        req.userId = userId;
        req.role = userRole;
        const expireDate = getExpireDate(60);
        res.cookie("userId", userId, {
            expires: new Date(expireDate),
        });
        next();
    }
    catch(err){
        console.log("[ERROR]: " + err);
        res.status(400).send(err);
    }

}
const logout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('userId');
    res.redirect('/auth/login')
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies;
        const userId = token.userId;
        if (!userId) {
            throw Error("Please login before moving on!");
        }
        req.userId = userId;
        next();
    } catch(err:any) {
        if(instanceOfNodeError(err, TypeError)){
            console.log("[ERROR]: " + err);
            res.status(400).json({
                "message": err.message
            });
        }
    }
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * This function try to connect to the Manufacturer's CA server to check,
 * whether the given user's id belongs to manufacturer
 */
const isManufacturer = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Manufacturer: ' + req.userId);
    try {
        const {userRole: role} = await getRole(req.userId!== undefined?req.userId:'');
        console.log("Role: " + role);
        if (role === "manufacturer") {
            next();
        }
    } catch(err) {
        console.log("[ERROR]: " + err);
        
    }
}

const isDistributor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userRole: role} = await getRole(req.userId!== undefined?req.userId:'');
        if (role === "distributor") {
            next();
        }
        
    } catch(err) {
        console.log("[ERROR]: " + err);
    }
}

const isRetailerUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userRole: role} = await getRole(req.userId!== undefined?req.userId:'');
        if (role === 'retailerunit') {
            next();
        }
    } catch(err) {
        console.log("[ERROR]: " + err);
    }
}
/**======================Helper functions======================*/

//Check the role base on userId
const checkRole = (req: Request, res: Response) => {
    const userRole = req.role;
    const redirectList = {
        "manufacturer": "/manufacturer",
        "distributor": "/distributor",
        "retailerunit": "/retailer-unit",
        "user": "/user",
    }

    console.log("Role: " + userRole);
    let destination = "";
    if(userRole!=undefined){
        if(hasKey(redirectList,userRole)){
            destination = redirectList[userRole as keyof typeof redirectList];
        } 
    } 
    res.redirect(destination);
}

const getRole = async (userId:string) => {
    const roles = ["manufacturer", "distributor", "retailerunit"];
    let wallet = {};
    let mspId = "";
    for (const role of roles) {
        let walletFolder = "";

        if (role === "manufacturer") {
            walletFolder = "wallet";
        }
        if (role === "distributor") {
            walletFolder = "walletDistributor"
        }
        if (role == "retailerunit") {
            walletFolder = "walletRetailer"
        }
        const walletPath = path.resolve(serverRoot, walletFolder);
        const tempWallet = await buildWallet(Wallets, walletPath);
        const userIdentity = await tempWallet.get(userId);
        if (userIdentity) {
            wallet = tempWallet;
            mspId = userIdentity.mspId;
            break;
        }
    }
    //Attach the role for later check
    const userRole = mspId.substring(0, mspId.length - 3).toLowerCase();
    return {
        wallet,
        userRole,
    };
}

/**
 * This utility function to calculate exxpire date of cookie
 */
const getExpireDate = (minute:number) => {
    const now = new Date();
    const time = now.getTime();
    const expireDate = time + 1000 * 60 * minute;
    now.setTime(expireDate);
    return now.toUTCString();
}

const appendRetailerUser = (userId:string) => {
    const listPath = path.resolve(serverRoot, "walletRetailer", "userList.json");
    //Get userlist
    const rawList = fs.readFileSync(listPath);
    let userList = JSON.parse(rawList);
    userList.users.push(userId);

    let data = JSON.stringify(userList);
    fs.writeFileSync(listPath, data);
}

// `PropertyKey` is short for "string | number | symbol"
// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj
}

module.exports = {
    signup,
    authenticate,
    logout,
    checkRole,
    verifyToken,
    isManufacturer,
    isDistributor, 
    isRetailerUnit,
};