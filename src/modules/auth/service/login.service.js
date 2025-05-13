import { asyncHandler } from "../../../utils/response/error.response.js";
import { userModel, roles } from "../../../DB/model/User.model.js";
import { compareHash, generateHash } from '../../../utils/security/hash.security.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { generateToken, verifyToken } from "../../../utils/security/token.security.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { OAuth2Client } from 'google-auth-library';
import { providerTypes } from "../../../DB/model/User.model.js";
import { findOne, updateOne } from "../../../DB/dbService.js";


export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await findOne({ model: userModel, filter: { email } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }
        if (!user.confirmEmail) {
            return next(new Error("confirm email before login", { cause: 400 }))
        }
        const match = compareHash({ planText: password, hashedValue: user.password })
        if (!match) {
            return next(new Error("in-valid password", { cause: 400 }))
        }
        const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
        const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
        return successResponse({ res: res, message: "login success", status: 200, data: { accessToken, refreshToken } })
    }

)
export const loginWithGmail = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body;
        console.log(idToken);

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
        const { email_verified, email, name, picture, provider } = payload
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
export const refreshToken = asyncHandler(
    async (req, res, next) => {
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ")
        if (!Bearer || !token) {
            return next(new Error("In-valid authorization", { cause: 400 }))

        }
        let signature;
        switch (Bearer) {
            case 'system':
                signature = process.env.SYSTEM_REFRESH_TOKEN
                break;
            case 'Bearer':
                signature = process.env.USER_REFRESH_TOKEN
                break;
            default: process.env.USER_REFRESH_TOKEN
                break;
        }
        const decoded = verifyToken({ token, signature })
        if (!decoded.userId) {
            return next(new Error("In-valid token payload", { cause: 401 }))

        }
        const user = await findOne({ model: userModel, filter: { _id: decoded.userId, isDeleted: false } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }

        const accessToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN, expiresIn: '1h' })
        const refreshToken = generateToken({ payload: { userId: user._id }, signature: user.role === roles.admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN, expiresIn: '1y' })
        return successResponse({ res: res, message: "success", status: 200, data: { accessToken, refreshToken } })
    }

)
export const fodgetPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body;
        const user = await findOne({ model: userModel, filter: { email, isDeleted: false } })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }


        emailEvent.emit("sendEmailForgetPassword", { email })

        return successResponse({ res })
    }

)
export const resetPassword = asyncHandler(
    async (req, res, next) => {
        const { email, password, code } = req.body;
        const user = await userModel.findOne({ email, isDeleted: false })
        if (!user) {
            return next(new Error("email not found", { cause: 404 }))
        }
        console.log(user.fogetPasswordOtp);


        if (!compareHash({ planText: code, hashedValue: user.fogetPasswordOtp })) {
            return next(new Error("in-valid OTP", { cause: 400 }))
        }
        const hashedPassword = generateHash({ planText: password })

        await updateOne({ model: userModel, filter: { email }, data: { password: hashedPassword, confirmEmail: true, changeCredentialsTime: Date.now(), $unset: { emailOtp: 0, fogetPasswordOtp: 0 } } })



        return successResponse({ res })
    }

)