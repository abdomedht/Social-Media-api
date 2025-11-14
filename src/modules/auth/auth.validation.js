/**
 * Joi validation schemas for authentication endpoints.
 * @module modules/auth/auth.validation
 */
import { generalFeilds } from "../../middleware/validation.middleware.js"
import joi from 'joi'
/**
 * Validation schema for user sign up.
 */
export const signUp =joi.object().keys({
    userName: generalFeilds.userName.required(),
    email:  generalFeilds.email.required(),
    password:generalFeilds.password.required(),
    confirmPassword:generalFeilds.confirmPassword,
    image:generalFeilds.image,
    dateOfBrith:generalFeilds.dateOfBrith,
    phone:generalFeilds.phone,
    coverImage:generalFeilds.coverImage,
    gender:generalFeilds.gender
}).required()
/**
 * Validation schema for confirming email.
 */
export const confirmEmail =joi.object().keys({
    email:  generalFeilds.email.required(),
    code: generalFeilds.code.required(),
}).required()
/**
 * Validation schema for login.
 */
export const logIn =joi.object().keys({
    
    email:  generalFeilds.email.required(),
    password:generalFeilds.password.required(),
   
}).required()
/**
 * Validation schema for forget password.
 */
export const forgetPassword =joi.object().keys({
    
    email:  generalFeilds.email.required(),
    
   
}).required()
/**
 * Validation schema for reset password.
 */
export const resetPassword =joi.object().keys({
    email:  generalFeilds.email.required(),
    code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
    password:generalFeilds.password.required(),

}).required()