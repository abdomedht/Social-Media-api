/**
 * Mongoose User model and related enums.
 * @module DB/model/User.model
 */
import mongoose, { model, Schema, Types } from "mongoose"
const commentSchema = new Schema({
    content: {
        type: String,
        minlength: 2,
        maxlength: 50000,
        trim: true,
        required: function () {
            return this.attachment?.length ? false : true;
        }
    },
    attachment: [{ secure_url: String, public_id: String }],
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    tags: [{ type: Types.ObjectId, ref: 'User' }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    postId: { type: Types.ObjectId, ref: 'Post', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    deletedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: Date
},
    { timestamps: true }
)


export const commentModel = mongoose.model.Comment || model('Comment', commentSchema)