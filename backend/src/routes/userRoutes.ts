import express from 'express';
import usersController from '../controllers/usersController';
import authController from '../controllers/authController';

const router = express.Router();

router.use(authController.protect);

router.route('/change-password').post(usersController.changePassword);

export default router;
