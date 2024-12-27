import express from 'express';
import habilitationController from '../controllers/habilitationController';
import authController from '../controllers/authController';

const router = express.Router();

router.use(authController.protect);

router.post('/menu', habilitationController.createOrUpdateMenu);
router.get('/menu', habilitationController.getAllMenus);

router.post('/permission', habilitationController.createOrUpdatePermission);
router.get('/permission', habilitationController.getAllPermissions);

router.post('/fonction', habilitationController.createOrUpdateFonction);
router.get('/fonction', habilitationController.getAllFonctions);

router.post('/fonction-menu-permission', habilitationController.createFonctionMenuPermission);
router.get('/fonction-menu-permission', habilitationController.getAllFonctionMenuPermissions);

router.post('/user-fonction', habilitationController.createUserFonction);
router.put('/user-fonction/', habilitationController.updateUserFonctionStatus);
router.get('/user-fonction', habilitationController.getAllUserFonctions);

export default router;
