import { asyncHandler } from '../../../utils/response/error.response.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { cloud } from '../../../utils/multer/cloudinary.multer.js'
import { commentModel } from '../../../DB/model/comment.model.js'
import { create, findOne } from '../../../DB/dbService.js'
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
        req.body.attachment=attachment
    }
    const comment = await create({
        model: commentModel,
        data: {
            ...req.body,
            postId,
            createdBy: req.user._id,
            
        },
        options: {
            new: true
        }
    });
    return successResponse({ res, message: "success", status: 201, data: { comment: comment } })
})