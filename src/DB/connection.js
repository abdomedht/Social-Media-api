/**
 * Connects to the MongoDB database using Mongoose.
 * @module DB/connection
 * @returns {Promise<void>} Resolves when connected.
 */
import mongoose from "mongoose";
export const connectDB = async () => {

    // eslint-disable-next-line no-undef
    return await mongoose.connect(process.env.DB_URI)
        // eslint-disable-next-line no-unused-vars
        .then(result => console.log(`data base connected`))
        .catch(err => console.error(`db not connected`, err))

}