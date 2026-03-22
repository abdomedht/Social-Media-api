import { Router } from "express";
import * as postService from './services/post.sevice.js'
import * as validators from './post.validation.js'
import {endpoint} from './post.authorization.js'
import{validation} from '../../middleware/validation.middleware.js'
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multe.js";
import { fileValidations } from "../../utils/multer/local.multer.js";



const router = Router();
router.post('/',authentication,authorization(endpoint.create),uploadCloudFile(fileValidations.image).array('attachment',2),validation(validators.createPost),postService.createPost)
router.patch('/:postId',authentication,authorization(endpoint.update),uploadCloudFile(fileValidations.image).array('attachment',2),validation(validators.updatePost),postService.updatePost)
router.delete('/:postId',authentication,authorization(endpoint.freeze),validation(validators.freezePost),postService.freezePost)
router.patch('/:postId/unfreeze',authentication,authorization(endpoint.unfreeze),validation(validators.unfreezePost),postService.unfreezePost)
router.patch('/:postId/likePost',authentication,authorization(endpoint.likePost),validation(validators.likePost),postService.likePost)
router.patch('/:postId/unlikePost',authentication,authorization(endpoint.unlikePost),validation(validators.unlikePost),postService.unlikePost)

export default router;