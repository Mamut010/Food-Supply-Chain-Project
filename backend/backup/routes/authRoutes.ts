/**
 * File for login/logout routes of the server
 * author: @NguyenTuanNgoc
 */
import express, { type Request, Response, Router } from 'express';
const router: Router = express.Router();
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const { getLoginUser } = require('../util/WebUtil');
const { enrollClient, buildCAClient } = require('../util/CAUtils');
const { User } = require('../util/User');

const SECRET_KEY = "secret_key#6969";

router.get("/", async function(req: Request, res: Response) {
    try {
        const user = getLoginUser()[req.cookies.session]
        if (!user) {
            res.sendStatus(401)
        } else {
            if (user.isRootAdmin) res.sendStatus(401)
            else res.sendStatus(200)
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/adminAuth", async function (req: Request, res: Response) {
    try {
        const user = getLoginUser()[req.cookies.session]
        if (!user) {
            res.sendStatus(401)
        } else {
            if (!user.isRootAdmin) res.sendStatus(401)
            else res.sendStatus(200)
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post("/login", async function (req: Request, res: Response) {
    let hash;
    try {
        const user = new User();
        // hash this user 
        hash = crypto.createHmac('sha256', SECRET_KEY).update(req.body.username).digest('hex');
        const validate = User.enrollUser(req.body.username,req.body.password,hash)
        if (!validate) throw new Error("Invalid username or password")
    } catch (err) {
        console.log(err);

    }
})

// temporary get user and delete the user after
router.get("/logout", async function (req: Request, res: Response) {
    try {
        delete getLoginUser()[req.cookies.session]
        res.clearCookie("session")
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
})