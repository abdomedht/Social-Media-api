import { create, findOneAndUpdate } from "../../../DB/dbService.js";
import { postModel } from "../../../DB/model/Post.model.js";
import { roles } from "../../../DB/model/User.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
export const createPost = asyncHandler(async (req, res) => {
  let attachment = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const { secure_url, public_id } =
        await cloud.uploader.upload(file.path, {
          folder: `posts/${req.user._id}`
        });

      attachment.push({ secure_url, public_id });
    }
  }
  const post = await create({
    model: postModel,
    data: {
      content: req.body.content,
      attachment: attachment,
      createdBy: req.user._id
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
  if (!post) {
    return next(new Error("Post not found or you don't have permission to edit it", { cause: 404 }));
  }
  return successResponse({ res, status: 200, message: "Post updated successfully", data: { post } })
});
export const freezePost = asyncHandler(async (req, res, next) => {
  const owner = req.user.role === roles.admin ? {} : { createdBy: req.user._id }
  const post = await findOneAndUpdate({
    model: postModel,
    filter: {
      _id: req.params.postId,
      isDeleted:  false ,
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
  console.log(post);
  
  if (!post) {
    return next(new Error("Post not found or you don't have permission to freeze it", { cause: 404 }));
  }

  return successResponse({ res, status: 200, message: "Post freezed successfully", data: { post } })
});