/* eslint-disable no-undef */
import path from 'path'
import * as dotenv from 'dotenv'
import cloudinary from 'cloudinary'
dotenv.config({ path:path.resolve('./src/config/.env.dev') });
// Configuration
cloudinary.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure:true
});
export const cloud = cloudinary.v2