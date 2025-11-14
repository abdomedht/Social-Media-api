
/**
 * Express router for user profile endpoints.
 * @module modules/user/user.controller
 */
import { Router } from 'express'
import { profile,shareProfile ,updateEmail,resetEmail,updatePassword,updateProfile} from '../user/services/profile.service.js';
import { authentication } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
import { shareProfileValidation,updateEmailV,resetEmailV,updatePasswordV,updateProfileV} from './user.validation.js';

const router = Router();

router.get('/profile',authentication, profile);
router.get('/profile/:profileId',validation(shareProfileValidation),authentication, shareProfile);
router.patch('/profile/update-email',validation(updateEmailV),authentication, updateEmail);
router.patch('/profile/reset-email',validation(resetEmailV),authentication, resetEmail);
router.patch('/profile/update-password',validation(updatePasswordV),authentication, updatePassword);
router.patch('/profile/update-profile',validation(updateProfileV),authentication, updateProfile);

export default router;