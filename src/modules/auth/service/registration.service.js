/**
 * Registration and email confirmation services for users.
 * @module modules/auth/service/registration.service
 */
import { asyncHandler } from "../../../utils/response/error.response.js";
import { userModel } from "../../../DB/model/User.model.js";
import { generateHash, compareHash } from '../../../utils/security/hash.security.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { emailEvent } from "../../../utils/events/email.event.js";
import { findOne, create, updateOne } from "../../../DB/dbService.js";
/**
 * Registers a new user and sends confirmation email.
 * @function
 */
export const signup = asyncHandler(
    async (req, res, next) => {
        const { email, password, userName } = req.body;
        if (await findOne({ model: userModel, filter: { email } })) {
            return next(new Error("email already exist"))
        }
        const hashedPassword = generateHash({ plainText : password});
        req.body.password = hashedPassword;
        const user = await create({ model: userModel, data: { ...req.body } })
        emailEvent.emit('sendEmail', {email: email} )
        return successResponse({ res: res, message: "sign-up success", status: 201, data: user._id })
    }

)
/**
 * Confirms a user's email using OTP code.
 * @function
 */
export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, code } = req.body;
        console.log(email, code);
        const user = await findOne({ model: userModel, filter: { email } })
        if (!user) {
            return next(new Error("email not exist"))
        }
        if (user.confirmEmail) {
            return next(new Error("email already confirmed", { cause: 409 }))
        }
        if (compareHash({ planText: code, hashedValue: user.emailOtp })) {
            await updateOne({ model: userModel, filter: { email }, data: { confirmEmail: true, $unset: { emailOtp: 0 } } })
            return successResponse({ res: res, message: "email confirmed", status: 200, data: user })
        }


        return next(new Error("invalid-otp", { cause: 400 }))


    }

)
