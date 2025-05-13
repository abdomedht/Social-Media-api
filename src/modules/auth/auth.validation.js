import { generalFeilds } from "../../middleware/validation.middleware.js"
import joi from 'joi'
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
export const confirmEmail =joi.object().keys({
    email:  generalFeilds.email.required(),
    code: joi.string().length(5).pattern(/^[0-9]+$/).required()
}).required()
export const logIn =joi.object().keys({
    
    email:  generalFeilds.email.required(),
    password:generalFeilds.password.required(),
   
}).required()
export const forgetPassword =joi.object().keys({
    
    email:  generalFeilds.email.required(),
    
   
}).required()
export const resetPassword =joi.object().keys({
    email:  generalFeilds.email.required(),
    code: joi.string().length(5).pattern(/^[0-9]+$/).required(),
    password:generalFeilds.password.required(),

}).required()