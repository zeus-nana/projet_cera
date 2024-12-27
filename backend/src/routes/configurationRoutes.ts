import express from 'express';
import authController from '../controllers/authController';
import etatController from '../controllers/etatController';
import listeToUseController from '../controllers/listeToUseController';
import agenceController from '../controllers/agenceController';
import mappingAgenceEtatController from '../controllers/mappingAgenceEtatController';

const router = express.Router();

router.use(authController.protect);

// Routes pour les etats
router.post('/etat', etatController.createOrUpdateEtat);
router.get('/etat', etatController.getAllEtats);

// Routes pour cle_liste
router.post('/cle-liste', listeToUseController.createOrUpdateCleListe);
router.get('/cle-liste', listeToUseController.getAllCleListes);

// Routes pour liste_to_use
router.post('/liste', listeToUseController.createOrUpdateListeToUse);
router.get('/liste', listeToUseController.getAllListeToUse);
router.get('/liste-by-cle', listeToUseController.getListeToUseByCle);

// Routes pour les agences
router.post('/agence', agenceController.createOrUpdateAgence);
router.get('/agence', agenceController.getAllAgences);
router.get('/agence/:code_agence', agenceController.getAgenceByCode);

// Routes pour les localités
router.get('/localite', agenceController.getAllLocalites);

// Routes pour le mapping agence-état
router.post('/mapping-agence-etat', mappingAgenceEtatController.createOrUpdateMappingAgenceEtat);
router.patch('/mapping-agence-etat/:id/toggle-status', mappingAgenceEtatController.toggleMappingStatus);
router.get('/mapping-agence-etat/agence/:agence_id', mappingAgenceEtatController.getMappingsByAgence);
router.get('/mapping-agence-etat/etat/:etat_id', mappingAgenceEtatController.getMappingsByEtat);

export default router;
