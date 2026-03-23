import { Router } from "express";
import*as commentService from './service/comment.services.js' 
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endpoint } from "./comment.authorization.js";
import { fileValidations, uploadCloudFile } from "../../utils/multer/cloud.multe.js";
import { validation } from "../../middleware/validation.middleware.js";
import *as validators  from "./comment.validation.js";
const router= Router({mergeParams:true});
router.post('/',authentication,authorization(endpoint.create),uploadCloudFile(fileValidations.image).array('attachment',2),validation(validators.create),commentService.createComment)
router.patch('/:commentId',authentication,authorization(endpoint.updateComment),uploadCloudFile(fileValidations.image).array('attachment',2),validation(validators.update),commentService.updateComment)
router.delete('/:commentId',authentication,authorization(endpoint.freeze),validation(validators.freeze),commentService.freezeComment)
router.patch('/:commentId/unfreeze',authentication,authorization(endpoint.unfreeze),validation(validators.unfreeze),commentService.unfreezeComment)

export default router;