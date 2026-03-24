import { asyncHandler } from '../../../utils/response/error.response.js'
import { successResponse } from '../../../utils/response/success.response.js'
import { cloud } from '../../../utils/multer/cloudinary.multer.js'
import { commentModel } from '../../../DB/model/comment.model.js'
import { create, findOne, findOneAndUpdate } from '../../../DB/dbService.js'
import { postModel } from '../../../DB/model/Post.model.js'
import { roles } from '../../../DB/model/User.model.js'
// eslint-disable-next-line no-unused-vars
export const createComment = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const post = await findOne({
        model: postModel,
        filter: {
            _id: postId,
            isDeleted: { $exists: false }
        }
    })
    if (!post) {
        return next(new Error('invalid post id ', { cause: 404 }))
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
            postId: postId,
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
    const { postId, commentId } = req.params
    const comment = await findOne({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            createdBy: req.user._id,
            isDeleted: { $exists: false }
        },
        populate: [
            {
                path: 'postId'
            }
        ]
    })
    if (!comment || comment.postId.isDeleted) {
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
        filter: {
            _id: commentId,
            postId,
            createdBy: req.user._id,
            isDeleted: { $exists: false }
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
export const freezeComment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params
    const comment = await findOne({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            isDeleted: { $exists: false }
        },
        populate: [{ path: 'postId' }]
    })

    if (!comment) {
        return next(new Error('comment not found', { cause: 404 }))
    }

    const isOwnerComment =
        comment.createdBy.toString() === req.user._id.toString()

    const isOwnerPost =
        comment.postId.createdBy.toString() === req.user._id.toString()

    const isAdmin = req.user.role === roles.admin

    if (!isOwnerComment && !isOwnerPost && !isAdmin) {
        return next(new Error('not authorized', { cause: 403 }))
    }

    const savedComment = await findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            isDeleted: { $exists: false }
        },
        data: {
            isDeleted: Date.now(),
            deletedBy: req.user._id
        },
        options: { new: true }
    })

    return successResponse({
        res,
        message: "success",
        status: 201,
        data: { comment: savedComment }
    })
})
export const unfreezeComment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params
    console.log(postId, commentId)
    const comment = await findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: commentId,
            postId,
            deletedBy: req.user._id,
            isDeleted: { $exists: true }
        },
        data: {
            $unset: {
                deletedBy: 0,

                isDeleted: 0
            }
        },
        options: { new: true }
    })
    if (!comment) {
        return next(new Error('comment not found', { cause: 404 }))
    }

    return successResponse({
        res,
        message: "success",
        status: 201,
        data: { comment: comment }
    })
})
export const likeComment = asyncHandler(async (req, res, next) => {
    const data = req.query.action === 'unlike' ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } }
    const comment = await findOneAndUpdate({
        model: commentModel,
        filter: {
            _id: req.params.commentId,
            isDeleted: { $exists: false },
        },
        data,
        options: {
            new: true
        },populate:{
            path:'postId'
        }
    });

    return comment||comment.postId.isDeleted==true ? successResponse({ res, status: 200, message: "success", data: { comment } }) : next(new Error("comment not found ", { cause: 404 }));
});