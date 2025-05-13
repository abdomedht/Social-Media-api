import bcrypt from 'bcrypt';
export const generateHash = ({ planText = "", salt = process.env.HASH_SALT } = {}) => {

    const hashedValue = bcrypt.hashSync(planText, parseInt(salt));
    return hashedValue;

}
export const compareHash = ({ planText = "", hashedValue = "" } = {}) => {

    console.log(planText,hashedValue);
    
    const match = bcrypt.compareSync(planText , hashedValue);
    console.log(match)
    return match;

}