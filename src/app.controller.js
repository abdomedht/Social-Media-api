/* eslint-disable no-unused-vars */

import Path from 'node:path'
import { connectDB } from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import user from './modules/user/user.controller.js'
import post from './modules/post/post.controller.js'
import { globalErrorHandling } from './utils/response/error.response.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    app.use('/uploads',express.static(Path.resolve('./src/uploads')))
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", user)
    app.use("/post", post)

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })

    app.use(globalErrorHandling)
    connectDB()
}
export default bootstrap;