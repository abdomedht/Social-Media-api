import mongoose, { model, Schema } from "mongoose"

export const genderValues = { male: "male", female: "female" }
export const roles = { admin: "male", user: "female" }
export const providerTypes = { system: "system", google: "google" }

const userSchema = new Schema({
    userName: {
        type: String,
        minlength: 2,
        maxlength: 60,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailOtp: String,
    password: { type: String },
    fogetPasswordOtp:String,

    confirmEmail: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: Object.values(genderValues),
        default: genderValues.male
    }, role: {
        type: String,
        enum: Object.values(roles),
        default: genderValues.user
    },
    provider: {
        type: String,
        enum: Object.values(providerTypes),
        default: providerTypes.system
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    image: String,
    coverImage: [String],
    phone: String,
    dateOfBrith: Date,
    changeCredentialsTime: Date,


},
    { timestamps: true }
)
export const userModel = mongoose.model.User || model('User', userSchema)