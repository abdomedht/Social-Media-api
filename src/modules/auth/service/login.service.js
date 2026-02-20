/**
 * Authentication and login services for users.
 * @module modules/auth/service/login.service
 */
import { asyncHandler } from "../../../utils/response/error.response.js";
import { userModel, roles } from "../../../DB/model/User.model.js";
import { compareHash, generateHash } from '../../../utils/security/hash.security.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { decodeToken, generateToken, tokenTypes, verifyToken } from "../../../utils/security/token.security.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { OAuth2Client } from 'google-auth-library';
import { providerTypes } from "../../../DB/model/User.model.js";
import { findOne, updateOne } from "../../../DB/dbService.js";
/**
 * Logs in a user with email and password.
 * @function
 */
export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await findOne({ model: userModel, filter: { email } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }
        if (!user.confirmEmail) {
            return next(new Error("confirm email before login", { cause: 400}))
        }
        const match = compareHash({ plainText: password, hashedValue: user.password })
        if (!match) {
            return next(new Error("in-valid password", { cause: 400 }))
        }
        const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
        const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
        return successResponse({ res: res, message: "login success", status: 200, data: { accessToken, refreshToken } })
    }
)
/**
 * Logs in a user with Google OAuth2.
 * @function
 */
export const loginWithGmail = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body;
        console.log(idToken);

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
        const { email_verified, email, name, picture } = payload
        console.log(email_verified, email, name, picture);

        console.log(payload)
        const user = await findOne({ model: userModel, filter: { email: payload.email } })
        if (!user) {
            const user = await userModel.create({ confirmEmail: email_verified, email: email, image: picture, userName: name, provider: providerTypes.google })
            const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
            const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
            return successResponse({ res: res, message: "success", status: 201, data: { accessToken, refreshToken } })
        }
        const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
        const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
        return successResponse({ res: res, message: "success", status: 200, data: { accessToken, refreshToken } })
    }
)
/**
 * Refreshes the user's access and refresh tokens.
 * @function
 */
export const refreshToken = asyncHandler(
    async (req, res, next) => {
        const user = await decodeToken({authorization:req.headers.authorization,tokenType:tokenTypes.refresh})
        const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
        const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
        return successResponse({ res: res, message: "success", status: 200, data: { accessToken, refreshToken } })
    }

)
/**
 * Sends a password reset OTP to the user's email.
 * @function
 */
export const forgetPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body;
        const user = await findOne({ model: userModel, filter: { email, isDeleted: false } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }
        emailEvent.emit("sendEmailForgetPassword", { email })
        return successResponse({ res, message: "reset code sent to your email", status: 200 })
    }

)
/**
 * Resets the user's password using OTP code.
 * @function
 */
export const resetPassword = asyncHandler(
    async (req, res, next) => {
        const { email, password , code } = req.body;
        const user = await findOne({ model: userModel, filter: { email, isDeleted: false } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }
        if (!user.forgetPasswordOtp || !compareHash({ plainText: code, hashedValue: user.forgetPasswordOtp })) {
            return next(new Error("in-valid OTP", { cause: 400 }))
        }
        const hashedPassword = generateHash({ plainText: password })
        await updateOne({ model: userModel, filter: { email }, data: { password: hashedPassword, confirmEmail: true, changeCredentialsTime: Date.now(), emailOtp: null, forgetPasswordOtp: null } })
        return successResponse({ res, message: "password reset successfully, you can login now", status: 200 })
    }

)