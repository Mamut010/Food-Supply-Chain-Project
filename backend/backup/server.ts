import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const morgan = require("morgan")
const helmet = require("helmet");
const path = require('path');

const { initApp, initLedger, initAdminAccounts } = require('./routes/index')


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Middlewares
app.use(morgan("common"))
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Routes apply
initApp(app);

// for page
app.use('/', express.static('pages'));

// for 404 page
app.use("*", function (req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '../pages/404.html'));
});

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});