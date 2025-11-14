/**
 * Entry point for the Node.js Express application.
 * Loads environment, sets up app, and starts server.
 * @module index
 */
import  bootstrap  from './src/app.controller.js';
import  express  from 'express';
import path from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config({path:path.resolve('./src/config/.env.dev')});
const app = express()
const port = process.env.PORT||3000

bootstrap(app , express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))