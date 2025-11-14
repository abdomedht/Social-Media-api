
/**
 * General Joi validation fields for user input.
 * @module middleware/validation.middleware
 */
import joi from "joi";
import { genderValues } from "../DB/model/User.model.js";
/**
 * General fields for validation schemas.
 * @type {Object}
 */
export const generalFeilds = {
    userName: joi.string().min(2).max(60).trim(),
    email: joi.string().email({ tlds: { allow: ['com', 'net'] } }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword: joi.string().valid(joi.ref('password')),
    image: joi.string(),
    dateOfBrith: joi.date(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    coverImage: joi.array(),
    gender: joi.string().valid(genderValues.male, genderValues.female),
    id: joi.string().pattern(new RegExp(/^[0-9a-fA-F]{24}$/)),
    code: joi.string().length(5).pattern(/^[0-9]+$/),
}




/**
 * Middleware to validate request data using a Joi schema.
 * @param {import('joi').ObjectSchema} Schema - Joi validation schema.
 * @returns {Function} Express middleware function.
 */
export const validation = (Schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.params, ...req.query };
        const validationResult = Schema.validate(inputData, { abortEarly: true })
        if (validationResult.error) {
            return res.status(400).json({ message: "validation error", details: validationResult.error.details })
        }
        return next()
    }
}