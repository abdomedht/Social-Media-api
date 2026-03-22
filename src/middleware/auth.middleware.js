
import { asyncHandler } from "../utils/response/error.response.js";
import { decodeToken } from "../utils/security/token.security.js";
export const authentication = asyncHandler(async (req, res, next) => {
    req.user = await decodeToken({ Authorization: req.headers.authorization })    
    return next()
})
export const authorization = (accessRoles) => {
    return asyncHandler(
        async (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!accessRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        });
};



