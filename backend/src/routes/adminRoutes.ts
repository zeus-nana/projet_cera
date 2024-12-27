import express from 'express';
import adminController from '../controllers/adminController';
import authController from '../controllers/authController';

const router = express.Router();

router.use(authController.protect);

router
  .route('/users')
  .get(adminController.getAllUsers)
  .post(adminController.createUpdateUser);

router.route('/users/:id').get(adminController.getUserById);

router
  .route('/reset-user-password/:id')
  .post(adminController.resetUserPassword);

router.route('/activate-user/:id').post(adminController.activateUser);

router.route('/deactivate-user/:id').post(adminController.deactivateUser);

export default router;
