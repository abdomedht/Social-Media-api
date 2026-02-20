/**
 * Event emitter for email-related events and OTP sending.
 * @module utils/events/email.event
 */
import { EventEmitter } from 'node:events'
import { sendEmail } from '../email/send.email.js'
import { customAlphabet } from 'nanoid'
import { emailOtpTemplate } from '../templates/email.template.js'
import { userModel } from '../../DB/model/User.model.js'
import { generateHash } from '../security/hash.security.js'
import { updateOne } from '../../DB/dbService.js'
/**
 * The main event emitter for email events.
 * @type {EventEmitter}
 */
export const emailEvent = new EventEmitter()
/**
 * Sends an OTP code to the user's email and updates the user document.
 * @param {Object} options
 * @param {Object} options.data - Data containing the user's email.
 * @param {string} [options.subject="confirm-email"] - Email subject.
 */
export const emailSubjects = {
    confirmEmail: "confirm-email",
    updateEmail: "update-email",
    resetPassword: "reset-password"

}
/**
 * Generates and sends an OTP code to the user's email, and updates the user document with the OTP hash.
 * Handles different subjects for confirmation, update, and reset password.
 *
 * @async
 * @param {Object} options - Options for sending the code.
 * @param {Object} options.data - Data containing the user's email, or { data: { email } } for compatibility.
 * @param {string} [options.subject="confirm-email"] - The subject/type of the email (confirmation, update, reset password).
 * @throws {Error} If no valid recipient email is provided or subject is invalid.
 */
const sendCode = async ({ data, subject = "confirm-email" } = {}) => {
    let email = null;
    if (data && typeof data === 'object') {
        if (data.email) {
            email = data.email;
        } else if (data.data && data.data.email) {
            email = data.data.email;
        }
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        console.error("No valid email provided to sendCode:", data);
        throw new Error("No recipient email provided");
    }

    const emailOtp = customAlphabet('0123456789', 5)();
    const html = emailOtpTemplate(emailOtp);
    const hash = generateHash({ plainText: `${emailOtp}` });
    console.log("Generated OTP:", emailOtp, "Hash:", hash);
    let updateData = {};
    let filter = {};

    switch (subject) {
        case emailSubjects.confirmEmail:
            updateData = { emailOtp: hash, confirmEmail: false };
            filter = { email };
            break;
        case emailSubjects.updateEmail:
            updateData = { tempEmailOtp: hash, confirmEmail: false };
            filter = { tempEmail: email };
            break;
        case emailSubjects.resetPassword:
            updateData = { forgetPasswordOtp: hash, confirmEmail: false };
            filter = { email };
            break;
        default:
            throw new Error("Invalid subject for sending code");
    }
    await updateOne({ model: userModel, filter, data: updateData });
    await sendEmail({ to: email, subject, html });
};
/**
 * Event: sendEmail - Sends confirmation email with OTP.
 * @event emailEvent#sendEmail
 * @param {Object} data - Data containing the user's email.
 */
emailEvent.on("sendEmail", async (data) => {
    await sendCode({ data, subject: emailSubjects.confirmEmail })
})
/**
 * Event: updateEmail - Sends update email with OTP to the user's temp email.
 * @event emailEvent#updateEmail
 * @param {Object} data - Data containing the user's temp email.
 */
emailEvent.on("updateEmail", async (data) => {
    await sendCode({ data, subject: emailSubjects.updateEmail })
})
/**
 * Event: sendEmailForgetPassword - Sends reset password email with OTP.
 * @event emailEvent#sendEmailForgetPassword
 * @param {Object} data - Data containing the user's email.
 */
emailEvent.on("sendEmailForgetPassword", async (data) => {
    await sendCode({ data, subject: emailSubjects.resetPassword })
})