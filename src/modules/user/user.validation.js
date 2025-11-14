/**
 * Joi validation schemas for user profile endpoints.
 * @module modules/user/user.validation
 */
import Joi from "joi";
import { generalFeilds } from "../../middleware/validation.middleware.js";
/**
 * Validation schema for sharing a profile.
 */
export const shareProfileValidation = Joi.object({}).keys({
    profileId: generalFeilds.id.required(),
    
}).required()
/**
 * Validation schema for updating email.
 */
export const updateEmailV = Joi.object().keys({
    email: generalFeilds.email.required(),
    
}).required()
export const resetEmailV = Joi.object().keys({
    oldCode: generalFeilds.code.required(),
    newCode: generalFeilds.code.required(),
    
}).required()
export const updatePasswordV = Joi.object().keys({
    oldPassword: generalFeilds.password.required(),
    password: generalFeilds.password.required(),
    confirmPassword: generalFeilds.password.required(),
    confirmPassword: Joi.ref('password')
}).required()
export const updateProfileV = Joi.object().keys({
    userName: generalFeilds.userName,
    dateOfBrith: generalFeilds.dateOfBrith,
    phone: generalFeilds.phone,
    gender: generalFeilds.gender,
    
}).required()