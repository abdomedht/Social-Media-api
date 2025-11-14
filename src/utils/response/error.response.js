/**
 * Wraps an async Express handler to catch errors and pass them to next().
 * @param {Function} fun - The async route handler.
 * @returns {Function} Wrapped handler.
 */
export const asyncHandler = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch((err) => {
            err.cause=500
            return next(err)
        })
    }


}
/**
 * Express global error handler middleware.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export const globalErrorHandling = (err, req, res, next) => {
    if (process.env.MOOD == "DEV") {
        return res.status(err.cause || 400).json({ message: err.message, stack: err.stack, error:err })
    }
    return res.status(err.cause || 400).json({ message: err.message })

}