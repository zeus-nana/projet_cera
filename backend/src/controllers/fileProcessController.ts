import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { defaultJobOptions, fileProcessingQueue } from '../../bullConfig';
import db from '../database/connection';
import { isValidTypeEtat } from '../type/TypeEtat';

// Créer le répertoire temporaire s'il n'existe pas
async function ensureTempDirectoryExists(directory: string) {
  try {
    await fs.access(directory);
  } catch (error) {
    await fs.mkdir(directory, { recursive: true });
  }
}

const TEMP_DIR = './src/data/temp/';
const FINAL_DIR = './src/data/etat/';

// Assurez-vous que les répertoires existent avant de configurer multer
ensureTempDirectoryExists(TEMP_DIR);
ensureTempDirectoryExists(FINAL_DIR);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR); // Stocke les fichiers dans le répertoire temporaire
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const userId = req.user ? req.user.id : 'unknown';
    cb(null, `${file.originalname.split('.')[0]}-${userId}${Date.now()}.${ext}`);
  },
});

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes: string[] = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Le format du fichier n'est pas supporté.", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFile = upload.array('files');

const processData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !Array.isArray(req.files)) {
    return next(new AppError("Aucun fichier n'a été téléchargé.", 400));
  }

  const userId = req.user!.id;

  // Valide tous les fichiers avant le traitement
  const invalidFiles = req.files.filter((file: Express.Multer.File) => {
    const fileName = file.originalname.split('.')[0].toLowerCase();
    return !isValidTypeEtat(fileName);
  });

  if (invalidFiles.length > 0) {
    // Supprime tous les fichiers téléchargés si au moins un est invalide
    await Promise.all(req.files.map((file: Express.Multer.File) => fs.unlink(file.path)));

    const invalidFileNames = invalidFiles.map((file) => file.originalname).join('\n');
    return next(new AppError(`Les fichiers suivants ne sont pas valides : ${invalidFileNames}`, 400));
  }

  // Tous les fichiers sont valides, on procède au traitement
  const fileProcessingPromises = req.files.map(async (file: Express.Multer.File) => {
    const fileName = file.originalname.split('.')[0].toLowerCase();
    const finalDestination = path.join(FINAL_DIR, path.basename(file.path));

    // Déplace le fichier du répertoire temporaire vers la destination finale
    await fs.rename(file.path, finalDestination);

    const chargementData = {
      etat: fileName,
      created_by: userId,
      type: 'transaction',
      chemin_fichier: finalDestination,
      statut: 'e',
    };

    // Insère les données de chargement dans la base de données
    const [id] = await db('chargement').insert(chargementData, 'id');

    // Ajoute la tâche de traitement à la file d'attente
    await fileProcessingQueue.add(
      'processFile',
      {
        filePath: finalDestination,
        chargement_id: id.id,
        fileName: fileName,
      },
      defaultJobOptions,
    );

    return id;
  });

  // Attend que tous les fichiers soient traités
  await Promise.all(fileProcessingPromises);

  res.status(200).json({
    status: 'succès',
    message: 'Téléchargement effectué avec succès, traitement en cours...',
  });
});

const downloadFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.query.path as string;

  if (!filePath) {
    return next(new AppError('Le chemin du fichier est requis.', 400));
  }

  // Construire le chemin absolu
  const absolutePath = path.resolve(process.cwd(), filePath);

  // Vérifier si le fichier existe
  try {
    await fs.access(absolutePath);
  } catch (error) {
    return next(new AppError('Fichier non trouvé.', 404));
  }

  // Envoyer le fichier
  res.sendFile(absolutePath, (err) => {
    if (err) {
      next(new AppError('Erreur lors du téléchargement du fichier.', 500));
    }
  });
});
export default {
  processData,
  uploadFile,
  downloadFile,
};
