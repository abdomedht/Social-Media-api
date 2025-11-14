/**
 * Sends a standardized success response.
 * @module utils/response/success.response
 * @param {Object} options
 * @param {Object} options.res - Express response object.
 * @param {string} [options.message='done'] - Success message.
 * @param {number} [options.status=200] - HTTP status code.
 * @param {Object} [options.data={}] - Response data.
 */
export const successResponse = ({ res, message = 'done', status = 200, data = {} } = {}) => {
    res.status(status).json({ message: message, data: data })
}