import { asyncHandler } from '../../../utils/response/error.response.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { cloud } from '../../../utils/multer/cloudinary.multer.js'
import { commentModel } from '../../../DB/model/comment.model.js'
import { create, findOne, findOneAndUpdate } from '../../../DB/dbService.js'
import { postModel } from '../../../DB/model/Post.model.js'
// eslint-disable-next-line no-unused-vars
export const createComment = asyncHandler(async (req, res, next) => {
    const {postId}=req.params
    const post= await findOne({
        model:postModel,
        filter:{
            _id:postId,
            isDeleted:{ $exists:false }
        }
    })
    if(!post){
        return next(new Error('invalid post id ',{cause:404}))
    }
    let attachment = [];
    if (req.files?.length) {
        for (const file of req.files) {
            const { secure_url, public_id } =
                await cloud.uploader.upload(file.path, {
                    folder: `posts/${req.user._id}/${postId}/comment`
                });
            attachment.push({ secure_url, public_id });
        }
    }
    const comment = await create({
        model: commentModel,
        data: {
            ...req.body,
            postId:postId,
            createdBy: req.user._id,
            attachment
        },
        options: {
            new: true
        }
    });
    return successResponse({ res, message: "success", status: 201, data: { comment: comment } })
})
export const updateComment = asyncHandler(async (req, res, next) => {
    const {postId,commentId}=req.params
    const comment= await findOne({
        model:commentModel,
        filter:{
            _id:commentId,
            postId,
            createdBy:req.user._id,
            isDeleted:{ $exists:false }
        },
        populate:[
            {
                path:'postId'
            }
        ]
    })
if (!comment||comment.postId.isDeleted) {
    return next(new Error('post is deleted or comment not found', { cause: 404 }))
}
    let attachment = [];
    if (req.files?.length) {
        for (const file of req.files) {
            const { secure_url, public_id } =
                await cloud.uploader.upload(file.path, {
                    folder: `posts/${req.user._id}/${postId}/comment`
                });
            attachment.push({ secure_url, public_id });
        }
    }
    const savedComment = await findOneAndUpdate({
        model: commentModel,
        filter:{
            _id:commentId,
            postId,
            createdBy:req.user._id,
            isDeleted:{$exists:false}
        },
        data: {
            ...req.body,
            attachment
        },
        options: {
            new: true
        }
    });
    return successResponse({ res, message: "success", status: 201, data: { comment: savedComment } })
})