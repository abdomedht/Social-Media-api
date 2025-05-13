export const asyncHandler = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch((err) => {
            err.cause=500
            return next(err)
        })
    }


}
export const globalErrorHandling = (err, req, res, next) => {
    if (process.env.MOOD == "DEV") {
        return res.status(err.cause || 400).json({ message: err.message, stack: err.stack, error:err })
    }
    return res.status(err.cause || 400).json({ message: err.message })

}