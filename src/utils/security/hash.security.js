/**
 * Hashing utility functions for password and OTP security.
 * @module utils/security/hash.security
 */
import bcrypt from 'bcrypt';
/**
 * Generates a bcrypt hash from plain text.
 * @param {Object} options
 * @param {string} options.plainText - The plain text to hash.
 * @param {string|number} [options.salt=process.env.HASH_SALT] - The salt rounds or value.
 * @returns {string} The hashed value.
 */
export const generateHash = ({ plainText = "", salt = process.env.HASH_SALT } = {}) => {

    // Ensure salt is a valid number of rounds, default to 10 if not set or invalid
    const saltRounds = Number.isInteger(Number(salt)) && Number(salt) > 0 ? Number(salt) : 10;
    const hashedValue = bcrypt.hashSync(plainText, saltRounds);
    return hashedValue;

}
/**
 * Compares a plain text value with a hashed value.
 * @param {Object} options
 * @param {string} options.plainText - The plain text to compare.
 * @param {string} options.hashedValue - The hashed value to compare against.
 * @returns {boolean} True if match, false otherwise.
 */
export const compareHash = ({ plainText = "", hashedValue = "" } = {}) => {
    const match = bcrypt.compareSync(plainText , hashedValue);
    return match;
}