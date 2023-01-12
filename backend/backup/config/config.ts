import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const path = require('path');

const { serverRoot, blockchainRoot, rootDir } = require("../helpers/pathUtil");

const applyParserConfig = (app:Express) => {
    app.use(cookieParser())
    app.use(bodyParser.json())                //npm -i --S express body-parser
    app.use(bodyParser.urlencoded({extended: false}))
}
 
module.exports = {
    applyParserConfig
}