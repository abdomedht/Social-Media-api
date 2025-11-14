/**
 * Express middleware for authenticating users via JWT.
 * @module middleware/auth.middleware
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
import { asyncHandler } from "../utils/response/error.response.js";
import { decodeToken } from "../utils/security/token.security.js";
export const authentication = 
    asyncHandler(async(req,res,next)=>{
        req.user=await decodeToken({autharization:req.headers.autharization})

        return next()
    })


