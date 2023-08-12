import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express-serve-static-core';
const cookieSession = require('cookie-session');

import { initApi } from './api';

const app = express();
// const ads = [
//   {title: 'Hello, world (again)!'}
// ];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(cookieSession({
  name: 'session',
  secret: process.env.SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const prisma = new PrismaClient();
initApi(app, prisma);

async function main() {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
