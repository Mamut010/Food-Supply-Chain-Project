import jsf from 'json-schema-faker';
import fs from 'fs';
import Ajv from "ajv"
const { readFileSync } = require('fs');

let channelList: any = {};// object for holding all the existing channel on the network
let loginUserList: any = {}; // object for holding all logged in user to channel

// exports.validateSchema = async function(object: any, channel: string,)

exports.getLoginUser = async function (){
    return loginUserList;
}