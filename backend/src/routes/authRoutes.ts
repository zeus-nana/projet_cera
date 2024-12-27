import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.use(authController.protect);

router.route('/change-password').post(authController.changePassword);
router.route('/verify').get(authController.verifyToken);
router.route('/current-user').get(authController.getCurrentUser);

export default router;
