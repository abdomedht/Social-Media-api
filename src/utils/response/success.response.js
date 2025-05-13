export const successResponse = ({ res, message = 'done', status = 200, data = {} } = {}) => {
    res.status(status).json({ message: message, data: data })
}