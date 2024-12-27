import express from 'express';
import authController from '../controllers/authController';
import reportingController from '../controllers/reportingController';

const router = express.Router();

router.use(authController.protect);

router.get('/transactions', reportingController.getTransactionByDate);
router.get(
  '/transactions-agrege',
  reportingController.getTransactionAgregeByDate,
);
router.get('/erreurs-chargement', reportingController.getErrorChargementById);
router.get('/chargements', reportingController.getChargementByDate);
router.get('/dashboard-data', reportingController.getDashboardData);

export default router;
