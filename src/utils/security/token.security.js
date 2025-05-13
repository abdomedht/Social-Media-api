import jwt from 'jsonwebtoken'
export const generateToken=({payload={},signature = process.env.USER_ACCESS_TOKEN,expiresIn = 1800}={})=>{
    const token = jwt.sign(payload,signature,{expiresIn})
    return token;
}
export const verifyToken=({token="",signature = process.env.USER_REFRESH_TOKEN}={})=>{
    const decoded = jwt.verify(token , signature)
    return decoded;
}