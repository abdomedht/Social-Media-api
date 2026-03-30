
import { Router } from 'express'
import { profile, shareProfile, updateEmail, resetEmail, updatePassword, updateProfile, updateProfileImage, updateCoverImage, dashboard, changeRole } from '../user/services/profile.service.js';
import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
import { shareProfileValidation, updateEmailV, resetEmailV, updatePasswordV, updateProfileV, updateProfileImageV, changeRoleV } from './user.validation.js';
import { fileValidations } from '../../utils/multer/local.multer.js';
import { uploadCloudFile } from '../../utils/multer/cloud.multe.js';
import { roles } from '../../DB/model/User.model.js';
const router = Router();
router.get('/profile', authentication, profile);
router.get('/profile/dashboard', authentication,authorization([roles.admin,roles.superAdmin]), dashboard);
router.patch('/profile/change-role/:userId', authentication,authorization([roles.admin,roles.superAdmin]),validation(changeRoleV),changeRole );
router.get('/profile/:profileId', validation(shareProfileValidation), authentication, shareProfile);
router.patch('/profile/update-email', validation(updateEmailV), authentication, updateEmail);
router.patch('/profile/reset-email', validation(resetEmailV), authentication, resetEmail);
router.patch('/profile/update-password', validation(updatePasswordV), authentication, updatePassword);
router.patch('/profile/update-profile', validation(updateProfileV), authentication, updateProfile);
router.patch('/profile/update-profile/image', validation(updateProfileImageV), authentication, uploadCloudFile( fileValidations.image).single('image'), updateProfileImage);
router.patch('/profile/update-profile/image/cover', validation(updateProfileImageV), authentication, uploadCloudFile( fileValidations.image).array('attachment', 3), updateCoverImage);
export default router;