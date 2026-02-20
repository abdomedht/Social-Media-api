/**
 * User profile services for profile viewing, sharing, and email update.
 * @module modules/user/services/profile.service
 */

/**
   * Gets the authenticated user's profile.
   * @function profile
   * @param {import('express').Request} req - Express request object, with authenticated user.
   * @param {import('express').Response} res - Express response object.
   * @returns {Promise<void>} Success response with user profile data.
   */

/**
   * Shares a user's profile with another user.
   * @function shareProfile
   * @param {import('express').Request} req - Express request object, with authenticated user and profileId param.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Success response with shared user profile data or error if sharing with self or user not found.
   */

/**
   * Updates the user's email address and sends a confirmation email.
   * @function updateEmail
   * @param {import('express').Request} req - Express request object, with authenticated user and new email in body.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Success response with updated user data or error if email exists or not provided.
   */

/**
   * Resets the user's email after OTP verification.
   * @function resetEmail
   * @param {import('express').Request} req - Express request object, with authenticated user and OTP codes in body.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Success response with updated user email or error if OTP codes are invalid or user not found.
   */

/**
   * Updates the user's password after verifying the old password.
   * @function updatePassword
   * @param {import('express').Request} req - Express request object, with authenticated user and passwords in body.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Success response with updated user password or error if old password is invalid or user not found.
   */
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { findOneAndUpdate, findOne, updateOne } from "../../../DB/dbService.js"
import { userModel } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js"
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
/**
 * Gets the authenticated user's profile.
 * @function
 */
export const profile = asyncHandler(
    async (req, res) => {
        return successResponse({ res, message: "hello", data: { user: req.user } })
    }
)
/**
 * Shares a user's profile with another user.
 * @function
 */
export const shareProfile = asyncHandler(
    async (req, res, next) => {
        const { profileId } = req.params
        let user = null
        if (profileId === req.user._id.toString()) {
            user = req.user
            return next(new Error("you can not share your profile with yourself"))
        }
        user = await findOneAndUpdate({ model: userModel, filter: { _id: profileId, isDeleted: false }, data: { $push: { viewers: { id: req.user._id, time: Date.now() } } }, options: { new: true } })
        return user ? successResponse({ res, message: "hello", data: { user } }) : next(new Error("user not found"))
    }
)
/**
 * Updates the user's email address and sends a confirmation email.
 * @function
 */
export const updateEmail = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body
        if (await findOne({ model: userModel, filter: { email } })) {
            return next(new Error("email already exist"))
        }
        if (!email) {
            return next(new Error("email is required"))
        }
        emailEvent.emit("sendEmail", { data: { id: req.user._id, email: req.user.email } })
        emailEvent.emit("updateEmail", { data: { email: email } })
        const user = await updateOne({ model: userModel, filter: { _id: req.user._id }, data: { tempEmail: email } })
        return user ? successResponse({ res, message: "hello", data: { user } }) : next(new Error("user not found"))
    }
)
export const resetEmail = asyncHandler(
    async (req, res, next) => {
        const { oldCode, newCode } = req.body
        if (!compareHash({ plainText: oldCode, hashedValue: req.user.emailOtp }) ||
            !compareHash({ plainText: newCode, hashedValue: req.user.tempEmailOtp })) {
            return next(new Error("you can not use old code"))
        }



        const user = await updateOne({ model: userModel, filter: { _id: req.user._id }, data: { email: req.user.tempEmail, tempEmail: "", changeCredentialsTime: Date.now(), confirmEmail: true, $unset: { emailOtp: 0, tempEmailOtp: 0 } } })
        return user ? successResponse({ res, message: "hello", data: { user } }) : next(new Error("user not found"))
    }
)
export const updatePassword = asyncHandler(
    async (req, res, next) => {
        const { oldPassword, password } = req.body
        if (!compareHash({ plainText: oldPassword, hashedValue: req.user.password })) {
            return next(new Error("invalid old password"))
        }
        console.log("update password", req.user._id, password);
        const user = await updateOne({
            model: userModel, filter: { _id: req.user._id },
            data: { changeCredentialsTime: Date.now(), password: generateHash({ plainText: password, salt: process.env.HASH_SALT }) }
        })
        return user ? successResponse({ res, message: "hello", data: { user } }) : next(new Error("user not found"))
    }
)
export const updateProfile = asyncHandler(
    async (req, res, next) => {
        
        const user = await findOneAndUpdate({
            model: userModel, filter: { _id: req.user._id },
            data: req.body,
            options: { new: true }
        })
        return user ? successResponse({ res, message: "profile updated", data: { user } }) : next(new Error("user not found"))
    }   
)

