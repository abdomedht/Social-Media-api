import mongoose from "mongoose";
import { userModel } from "./model/User.model.js";
export const connectDB = async () => {

    return await mongoose.connect(process.env.DB_URI)
        .then(result => console.log(`data base connected`))
        .catch(err => console.error(`db not connected`, err))

}