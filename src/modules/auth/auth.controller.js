
/**
 * Express router for authentication endpoints.
 * @module modules/auth/auth.controller
 */
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as registrationService from './service/registration.service.js';
import * as validators from './auth.validation.js';
import { validation } from '../../middleware/validation.middleware.js';
import { forgetPassword, login, loginWithGmail, refreshToken, resetPassword } from './service/login.service.js';

const router = Router();
router.post("/signup", validation(validators.signUp), registrationService.signup)
router.patch("/confirm-email", validation(validators.confirmEmail), registrationService.confirmEmail)
router.post("/login", validation(validators.logIn), login)
router.post("/loginWithGmail", loginWithGmail)
router.get("/refresh-token", refreshToken)
router.patch("/forget-password", validation(validators.forgetPassword), forgetPassword)
router.patch("/reset-password", validation(validators.resetPassword), resetPassword)

export default router