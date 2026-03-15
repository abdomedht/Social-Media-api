import { create } from "../../../DB/dbService.js";
import { postModel } from "../../../DB/model/Post.model.js";
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
  return successResponse({ res, message: "Post created successfully", post })
});