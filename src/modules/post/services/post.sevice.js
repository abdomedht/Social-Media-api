import { create, findAll, findOneAndUpdate } from "../../../DB/dbService.js";
import { postModel } from "../../../DB/model/Post.model.js";
import { roles } from "../../../DB/model/User.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
export const getPosts = asyncHandler(async (req, res) => {
  
  const post = await findAll({
    model: postModel,
    filter: {
      isDeleted:{$exists:false}
    },
    populate:[
      {
        path:'createdBy',
        select:"userName image"
      }
      ,{
        path:'likes',
        select:"userName image"
      }
    ]
  });
  return successResponse({ res, status: 201, message: "Post created successfully", data: { post } })
});
export const createPost = asyncHandler(async (req, res) => {
  const {_id}=req.user
  let attachment = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const { secure_url, public_id } =
        await cloud.uploader.upload(file.path, {
          folder: `posts/${req.user._id}`
        });

      attachment.push({ secure_url, public_id,_id });
    }
  }
  console.log(attachment)
  const post = await create({
    model: postModel,
    data: {
      content: req.body.content,
      attachment: attachment,
      createdBy: req.user._id
    },
    options: {
      new: true
    }
  });
  return successResponse({ res, status: 201, message: "Post created successfully", data: { post } })
});
export const updatePost = asyncHandler(async (req, res, next) => {
  let attachment = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const { secure_url, public_id } =
        await cloud.uploader.upload(file.path, {
          folder: `posts/${req.user._id}`
        });
      attachment.push({ secure_url, public_id });
      console.log(attachment)
    }
    req.body.attachment = attachment
  }
  const post = await findOneAndUpdate({
    model: postModel,
    filter: { _id: req.params.postId, createdBy: req.user._id, isDeleted: { $exists: false } },
    data: {
      ...req.body,
      updatedBy: req.user._id
    },
    options: {
      new: true
    }
  });
  return post? successResponse({ res, status: 200, message: "Post updated successfully", data: { post } }): next(new Error("Post not found or you don't have permission to edit it", { cause: 404 }));
});
export const freezePost = asyncHandler(async (req, res, next) => {
  const owner = req.user.role === roles.admin ? {} : { createdBy: req.user._id }
  const post = await findOneAndUpdate({
    model: postModel,
    filter: {
      _id: req.params.postId,
      isDeleted: { $exists: false },
      ...owner,
    },
    data: {
      isDeleted: true,
      ...req.body,
      deletedBy: req.user._id
    },
    options: {
      new: true
    }
  });
  return post? successResponse({ res, status: 200, message: "Post unfreezed successfully", data: { post } }):
  next(new Error("Post not found or you don't have permission to unfreeze it", { cause: 404 }));
});
export const unfreezePost = asyncHandler(async (req, res, next) => {
  console.log(req.user._id)
  const post = await findOneAndUpdate({
    model: postModel,
    filter: {
      _id: req.params.postId,
      isDeleted: { $exists: true },
      deletedBy: req.user._id
    },
    data: {
      $unset: {
        isDeleted: 0,
        deletedBy: 0
      },
      ...req.body,
    },
    options: {
      new: true
    }
  });
  return post? successResponse({ res, status: 200, message: "Post unfreezed successfully", data: { post } }):
  next(new Error("Post not found or you don't have permission to unfreeze it", { cause: 404 }));
});
export const likePost = asyncHandler(async (req, res, next) => {
const data =req.query.action==='unlike'?{$pull:{likes:req.user._id}}:{ $addToSet:{likes:req.user._id}}
  const post = await findOneAndUpdate({
    model: postModel,
    filter: {
      _id: req.params.postId,
      isDeleted: { $exists: false },
    },
    data,
    options: {
      new: true
    }
  });
  return post? successResponse({ res, status: 200, message: "success", data: { post } }):next(new Error("Post not found ", { cause: 404 }));
});
