/**
 * Token utility functions for authentication and authorization.
 * @module utils/security/token.security
 */
import jwt from 'jsonwebtoken'
import { userModel } from '../../DB/model/User.model.js'
import { findOne } from '../../DB/dbService.js'

/**
 * Enum for token types.
 * @readonly
 * @enum {string}
 */
export const tokenTypes = {
    access: "access", refresh: "refresh"
}

/**
 * Decodes and verifies a JWT token, returning the associated user.
 * @async
 * @param {Object} options
 * @param {string} options.autharization - The authorization header value.
 * @param {string} [options.tokenType=tokenTypes.access] - The type of token.
 * @returns {Promise<Object>} The user document.
 * @throws {Error} If the token is invalid or user not found.
 */
export const decodeToken = async ({ autharization = "", tokenType = tokenTypes.access } = {}) => {
    const [Bearer, token] = autharization.split(" ");
    if (!Bearer || !token) {
        console.error("No token provided in authorization header:", autharization);
        throw new Error("In-valid authorization");
    }
    let accessSignature;
    let refreshSignature;

    switch (Bearer) {
        case 'system':
            refreshSignature = process.env.SYSTEM_REFRESH_TOKEN;
            accessSignature = process.env.SYSTEM_ACCESS_TOKEN;
            break;
        case 'Bearer':
            refreshSignature = process.env.USER_REFRESH_TOKEN;
            accessSignature = process.env.USER_ACCESS_TOKEN;
            break;
        default:
            refreshSignature = process.env.USER_REFRESH_TOKEN;
            accessSignature = process.env.USER_ACCESS_TOKEN;
            break;
    }
    let decoded;
    try {
        decoded = verifyToken({ token, signature: tokenType == tokenTypes.access ? accessSignature : refreshSignature });
    } catch (err) {
        throw new Error("Invalid token");
    }
    if (!decoded.userId) {
        throw new Error("In-valid token payload");
    }
    const user = await findOne({ model: userModel, filter: { _id: decoded.userId, isDeleted: false } });
    if (!user) {
        throw new Error("email not found");
    }
    if (user.changeCredentialsTime?.getTime() >= decoded.iat * 1000) {
        throw new Error("changeCredentialsTime");
    }
    return user;

}

/**
 * Generates a JWT token.
 * @param {Object} options
 * @param {Object} [options.payload={}] - The payload to encode.
 * @param {string} [options.signature=process.env.USER_ACCESS_TOKEN] - The secret key.
 * @param {number|string} [options.expiresIn=1800] - Expiry time in seconds or a string describing a time span.
 * @returns {string} The signed JWT token.
 */
export const generateToken=({payload={},signature = process.env.USER_ACCESS_TOKEN,expiresIn = 1800}={})=>{
    const token = jwt.sign(payload,signature,{expiresIn})
    return token;
}

/**
 * Verifies a JWT token.
 * @param {Object} options
 * @param {string} options.token - The JWT token.
 * @param {string} [options.signature=process.env.USER_REFRESH_TOKEN] - The secret key.
 * @returns {Object} The decoded payload.
 * @throws {Error} If the token is invalid.
 */
export const verifyToken=({token="",signature = process.env.USER_REFRESH_TOKEN}={})=>{
    const decoded = jwt.verify(token , signature)
    return decoded;
}