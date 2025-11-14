/**
 * Sends an email using nodemailer and Gmail service.
 * @module utils/email/send.email
 */
import nodemailer from 'nodemailer';
/**
 * Sends an email with the given options.
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email address(es).
 * @param {string} [options.subject] - Email subject.
 * @param {string} [options.text] - Plain text content.
 * @param {string} [options.html] - HTML content.
 * @param {Array} [options.attachments] - Attachments array.
 * @returns {Promise<void>} Resolves when email is sent.
 */
export const sendEmail = async ({ to = [], subject = "", text = "", html = "", attachments = [] } = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
            attachments
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}

