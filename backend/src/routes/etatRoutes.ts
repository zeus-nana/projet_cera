import express from 'express';
import authController from '../controllers/authController';
import etatController from '../controllers/etatController';

const router = express.Router();

router.use(authController.protect);

router.post('/etat', etatController.createOrUpdateEtat);
router.get('/etat', etatController.getAllEtats);

export default router;
