
import joi from "joi";
import { genderValues } from "../DB/model/User.model.js";
export const generalFeilds = {
    userName: joi.string().min(2).max(60).trim(),
    email: joi.string().email({ tlds: { allow: ['com', 'net'] }, minDomainSegments: 2, maxDomainSegments: 3 }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword: joi.string().valid(joi.ref('password')),
    image: joi.string(),
    dateOfBrith: joi.date(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    coverImage: joi.array(),
    gender: joi.string().valid(genderValues.male, genderValues.female)
}




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