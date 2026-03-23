import joi from "joi";
import { generalFeilds } from "../../middleware/validation.middleware.js";
export const create=joi.object().keys({
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
        postId:generalFeilds.id.required(),
        likes: joi.array().items(generalFeilds.id),
        tags: joi.array().items(generalFeilds.id),
    
        createdBy: generalFeilds.id,
    
        updatedBy: generalFeilds.id.optional(),
    
        deletedBy: generalFeilds.id.optional(),
    
        isDeleted: joi.boolean().default(false)
}).required()
export const update=joi.object().keys({
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
        postId:generalFeilds.id.required(),
        likes: joi.array().items(generalFeilds.id),
        tags: joi.array().items(generalFeilds.id),
        commentId:generalFeilds.id.required(),
        createdBy: generalFeilds.id,
        updatedBy: generalFeilds.id.optional(),
    
        deletedBy: generalFeilds.id.optional(),
    
        isDeleted: joi.boolean().default(false)
}).required()