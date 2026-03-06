/**
 * Joi validation schemas for user profile endpoints.
 * @module modules/user/user.validation
 */
import Joi from "joi";
import { generalFeilds } from "../../middleware/validation.middleware.js";

/**
 * Validation schema for updating profile image
 */
export const updateProfileImageV = Joi.object({

}).required();

/**
 * Validation schema for sharing a profile
 */
export const shareProfileValidation = Joi.object({
  profileId: generalFeilds.id.required(),
}).required();

/**
 * Validation schema for updating email
 */
export const updateEmailV = Joi.object({
  email: generalFeilds.email.required(),
}).required();

/**
 * Validation schema for resetting email
 */
export const resetEmailV = Joi.object({
  oldCode: generalFeilds.code.required(),
  newCode: generalFeilds.code.required(),
}).required();

/**
 * Validation schema for updating password
 */
export const updatePasswordV = Joi.object({
  oldPassword: generalFeilds.password.required(),

  password: generalFeilds.password.required(),

  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm password must match password'
    }),
}).required();

/**
 * Validation schema for updating profile data
 */
export const updateProfileV = Joi.object({
  userName: generalFeilds.userName,
  dateOfBrith: generalFeilds.dateOfBrith, // سيبه زي ما هو لو مستخدمه
  phone: generalFeilds.phone,
  gender: generalFeilds.gender,
}).required();