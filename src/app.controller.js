/**
 * Bootstraps the Express app with routes, middleware, and DB connection.
 * @module app.controller
 * @param {import('express').Express} app - The Express app instance.
 * @param {Function} express - The Express module.
 */
import { connectDB } from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import user from  './modules/user/user.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'
const bootstrap = (app, express) => {
    app.use(express.json())

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", user)


    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })
    app.use(globalErrorHandling)
    connectDB()

}

export default bootstrap