import express from 'express';
import fileProcessController from '../controllers/fileProcessController';
import authController from '../controllers/authController';

const router = express.Router();

router.use(authController.protect);

router
  .route('/upload')
  .post(fileProcessController.uploadFile, fileProcessController.processData);

router.get('/download', fileProcessController.downloadFile);

export default router;
