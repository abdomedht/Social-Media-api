import { generalFeilds } from "../../middleware/validation.middleware.js";
import joi from 'joi';
export const createPost = joi.object().keys({
    content: joi.string()
        .min(2)
        .max(50000)
        .trim()
        .when('attachment', {
            is: joi.array().min(1),
            then: joi.optional(),
            otherwise: joi.required()
        }),
    attachment: joi.array().items(
        joi.object({
            secure_url: joi.string().uri().required(),
            public_id: joi.string().required()
        })
    ),

    likes: joi.array().items(generalFeilds.id),

    tags: joi.array().items(generalFeilds.id),

    createdBy: generalFeilds.id,

    updatedBy: generalFeilds.id.optional(),

    deletedBy: generalFeilds.id.optional(),

    isDeleted: joi.boolean().default(false)
}).required()

export const updatePost = joi.object().keys({
    postId: generalFeilds.id.required(),
    content: joi.string()
        .min(2)
        .max(50000)
        .trim()
        .when('attachment', {
            is: joi.array().min(1),
            then: joi.optional(),
            otherwise: joi.required()
        }),
    attachment: joi.array().items(
        joi.object({
            secure_url: joi.string().uri().required(),
            public_id: joi.string().required()
        })
    ),

    likes: joi.array().items(generalFeilds.id),

    tags: joi.array().items(generalFeilds.id),

    createdBy: generalFeilds.id,

    updatedBy: generalFeilds.id.optional(),

    deletedBy: generalFeilds.id.optional(),

    isDeleted: joi.boolean().default(false)
}).required()
export const freezePost = joi.object().keys({
    postId: generalFeilds.id.required(),
}).required()
export const unfreezePost = joi.object().keys({
    postId: generalFeilds.id.required(),
}).required()
export const like = joi.object().keys({
    postId: generalFeilds.id.required(),
    action:joi.string().valid('like','unlike')
}).required()

export const getPost = joi.object().keys({
})