const { json } = require('express');
import express, { type Request, Response } from 'express';
const router = express.Router();
const {createContract, disconnetGateway}=require('../helpers/web_util')
const RenderMiddleware = require('../middleware/RenderMiddleware');

router.get('/login', RenderMiddleware.loginPage);
router.post('/login', RenderMiddleware.getInfo)
router.get('/user', RenderMiddleware.userPage)

interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray;
}
interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }

function JSONlencount(json:any) {
    var count=0;
    for(var prop in json) {
       if (json.hasOwnProperty(prop)) {
          ++count;
       }
    }
    return count;
}

function testSpecChar(str: string){     
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    return format.test(str)
}

function JSONvalidator(json:any){
    var bool=true
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
        bool=testSpecChar(json[i]);
        if (bool == false) break
    }
    return bool
}
router.post('/parcip/testing',async (req: Request , res: Response)=>{
    var givenlength=JSONlencount(req.body)
    if (givenlength != 2){
        res.send("wrong amount of data given")        //wrong format
    }
    else {//right number of field, check field content maybe ? depending 
       if (JSONvalidator(req.body)){
           res.send("nothing unexpected happened, transaction submitted")
       }
       else {
           res.send("malixious")
       }
    }
})
router.post('/parcip/test2',async (req: Request, res: Response)=>{
    var var1 = String(req.body.var1)
    var var2 = String(req.body.var2)
    try {
        const contract = await createContract();
        let result = await contract.submitTransaction('UpdateProductUnitMeasurement', var1, var2);
        res.send(result);
    } catch (error) {
        console.log('error: ' + error);
        res.send(404);
    } finally {
        disconnetGateway();
    }
})
module.exports = router;