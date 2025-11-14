/**
 * Mongoose User model and related enums.
 * @module DB/model/User.model
 */
import mongoose, { model, Schema } from "mongoose"

/**
 * Enum for gender values.
 * @readonly
 * @enum {string}
 */
export const genderValues = { male: "male", female: "female" }
/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
export const roles = { admin: "male", user: "female" }
/**
 * Enum for provider types.
 * @readonly
 * @enum {string}
 */
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
    tempEmail: String,
    tempEmailOtp: String,
    viewers: [
        {
           userId: { type: Schema.Types.ObjectId, ref: "User" },
            time: { type: Date, default: Date.now }
        }
    ],

},
    { timestamps: true }
)
/**
 * The User mongoose model.
 * @type {mongoose.Model}
 */
export const userModel = mongoose.model.User || model('User', userSchema)