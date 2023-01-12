import { type Request, Response } from 'express';

const loginPage = (req: Request, res: Response) => {
    res.render('login', {
        isLoginPage: true
    })
}

const registerPage = (req: Request, res: Response) => {
    res.render('signup');
}

const userPage = (req: Request, res: Response) => {
    res.render('user', {
        isUserPage: true
    })
}

const manufacturerPage = (req: Request, res: Response) => {
    res.render('manufacturer');
}

const manufacturerDeliveryPage = (req: Request, res: Response) => {
    res.render('manufacturerDelivery')
}

const retailerUnitPage = (req: Request, res: Response) => {
    res.render('retailerunit')
}

const retailerUnitDeliveryPage = (req: Request, res: Response) => {
    res.render('retailerunitDelivery');
}

const distributorPage = (req: Request, res: Response) => {
    res.render('distributor');
}

const distributorDeliveryPage = (req: Request, res: Response) => {
    res.render('distributorDelivery');
}

const getInfo = (req: Request, res: Response) => {
    const body = req.body;
    console.log(body);
}

module.exports = {
    loginPage,
    registerPage,
    getInfo,
    userPage,
    manufacturerPage,
    manufacturerDeliveryPage,
    retailerUnitPage,
    retailerUnitDeliveryPage,
    distributorPage,
    distributorDeliveryPage
}