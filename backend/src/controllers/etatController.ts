import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import db from '../database/connection';

interface EtatCreate {
  etat: string;
  created_by: number;
}

const createOrUpdateEtat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, etat } = req.body;

  if (!etat) {
    return res.status(400).json({
      status: 'échec',
      message: "Le nom de l'état est requis",
    });
  }

  try {
    if (id) {
      // Mise à jour d'un état existant
      const existingEtat = await db('etat').where('id', id).first();
      if (!existingEtat) {
        return res.status(404).json({
          status: 'échec',
          message: 'État non trouvé',
        });
      }

      const etatWithSameName = await db('etat').where('etat', etat).whereNot('id', id).first();
      if (etatWithSameName) {
        return res.status(400).json({
          status: 'échec',
          message: 'Un état avec ce nom existe déjà',
        });
      }

      const [updatedEtat] = await db('etat').where('id', id).update(
        {
          etat,
          updated_by: req.user!.id,
        },
        ['id', 'etat'],
      );

      return res.status(200).json({
        status: 'succès',
        data: {
          etat: updatedEtat,
        },
      });
    } else {
      // Création d'un nouvel état
      const existingEtat = await db('etat').where('etat', etat).first();
      if (existingEtat) {
        return res.status(400).json({
          status: 'échec',
          message: 'Un état avec ce nom existe déjà',
        });
      }

      const nouvelEtat: EtatCreate = {
        etat,
        created_by: req.user!.id,
      };

      const [createdEtat] = await db('etat').insert(nouvelEtat, ['id', 'etat']);

      return res.status(201).json({
        status: 'succès',
        data: {
          etat: createdEtat,
        },
      });
    }
  } catch (error) {
    console.error("Erreur lors de la création ou mise à jour de l'état:", error);
    return res.status(500).json({
      status: 'échec',
      message: "Erreur lors de la création ou mise à jour de l'état",
    });
  }
});

const getAllEtats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const etats = await db('etat')
    .join('users as creator', 'etat.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'etat.updated_by', '=', 'updater.id')
    .select('etat.*', 'creator.login as created_by', 'updater.login as updated_by');

  console.log('etat :: ', etats);

  res.status(200).json({
    status: 'succès',
    data: {
      etats,
    },
  });
});

export default {
  createOrUpdateEtat,
  getAllEtats,
};
