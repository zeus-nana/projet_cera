import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import db from '../database/connection';

// Interfaces
interface CleListeCreate {
  libelle: string;
  created_by: number;
}

interface ListeToUseCreate {
  code: string;
  libelle: string;
  cle_liste_id: number;
  created_by: number;
}

const createOrUpdateCleListe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, libelle } = req.body;

  if (!libelle) {
    return next(new AppError('Le libellé est requis', 400));
  }

  try {
    if (id) {
      const existingCleListe = await db('cle_liste').where('id', id).first();
      if (!existingCleListe) {
        return next(new AppError('Clé de liste non trouvée', 404));
      }

      const cleListeWithSameLibelle = await db('cle_liste').where('libelle', libelle).whereNot('id', id).first();
      if (cleListeWithSameLibelle) {
        return next(new AppError('Une clé de liste avec ce libellé existe déjà', 400));
      }

      const [updatedCleListe] = await db('cle_liste').where('id', id).update(
        {
          libelle,
          updated_by: req.user!.id,
        },
        ['id', 'libelle'],
      );

      return res.status(200).json({
        status: 'success',
        data: {
          cle_liste: updatedCleListe,
        },
      });
    } else {
      const existingCleListe = await db('cle_liste').where('libelle', libelle).first();
      if (existingCleListe) {
        return next(new AppError('Une clé de liste avec ce libellé existe déjà', 400));
      }

      const nouvelleCleListe: CleListeCreate = {
        libelle,
        created_by: req.user!.id,
      };

      const [createdCleListe] = await db('cle_liste').insert(nouvelleCleListe, ['id', 'libelle']);

      return res.status(201).json({
        status: 'success',
        data: {
          cle_liste: createdCleListe,
        },
      });
    }
  } catch (error) {
    return next(new AppError('Erreur lors de la création ou mise à jour de la clé de liste', 500));
  }
});

const createOrUpdateListeToUse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, code, libelle, cle_liste_id } = req.body;

  if (!code || !libelle || !cle_liste_id) {
    return next(new AppError('Le code, le libellé et la clé de liste sont requis', 400));
  }

  try {
    const cleListeExists = await db('cle_liste').where('id', cle_liste_id).first();
    if (!cleListeExists) {
      return next(new AppError("La clé de liste spécifiée n'existe pas", 400));
    }

    if (id) {
      const existingListe = await db('liste_to_use').where('id', id).first();
      if (!existingListe) {
        return next(new AppError('Liste non trouvée', 404));
      }

      const listeWithSameCode = await db('liste_to_use').where({ code, cle_liste_id }).whereNot('id', id).first();

      if (listeWithSameCode) {
        return next(new AppError('Une liste avec ce code existe déjà pour cette clé', 400));
      }

      const [updatedListe] = await db('liste_to_use').where('id', id).update(
        {
          code,
          libelle,
          cle_liste_id,
          updated_by: req.user!.id,
        },
        ['id', 'code', 'libelle', 'cle_liste_id'],
      );

      return res.status(200).json({
        status: 'success',
        data: {
          liste: updatedListe,
        },
      });
    } else {
      const existingListe = await db('liste_to_use').where({ code, cle_liste_id }).first();

      if (existingListe) {
        return next(new AppError('Une liste avec ce code existe déjà pour cette clé', 400));
      }

      const nouvelleListe: ListeToUseCreate = {
        code,
        libelle,
        cle_liste_id,
        created_by: req.user!.id,
      };

      const [createdListe] = await db('liste_to_use').insert(nouvelleListe, ['id', 'code', 'libelle', 'cle_liste_id']);

      return res.status(201).json({
        status: 'success',
        data: {
          liste: createdListe,
        },
      });
    }
  } catch (error) {
    return next(new AppError('Erreur lors de la création ou mise à jour de la liste', 500));
  }
});

const getAllCleListes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cleListes = await db('cle_liste')
    .join('users as creator', 'cle_liste.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'cle_liste.updated_by', '=', 'updater.id')
    .select('cle_liste.*', 'creator.login as created_by_login', 'updater.login as updated_by_login');

  res.status(200).json({
    status: 'success',
    results: cleListes.length,
    data: {
      cle_listes: cleListes,
    },
  });
});

const getAllListeToUse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const listes = await db('liste_to_use')
    .join('cle_liste', 'liste_to_use.cle_liste_id', '=', 'cle_liste.id')
    .join('users as creator', 'liste_to_use.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'liste_to_use.updated_by', '=', 'updater.id')
    .select(
      'liste_to_use.*',
      'cle_liste.libelle as usage',
      'creator.login as created_by_login',
      'updater.login as updated_by_login',
    )
    .orderBy(['cle_liste.libelle', 'liste_to_use.code']);

  console.log('usage :: ', listes);

  res.status(200).json({
    status: 'success',
    results: listes.length,
    data: {
      listes,
    },
  });
});

const getListeToUseByCle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { libelle } = req.query;

  if (!libelle) {
    return next(new AppError('Le libellé de la clé est requis', 400));
  }

  try {
    // Vérifier d'abord si la clé existe
    const cleExist = await db('cle_liste').where('libelle', libelle).first();

    if (!cleExist) {
      return next(new AppError('Aucune clé trouvée avec ce libellé', 404));
    }

    const listes = await db('liste_to_use')
      .join('cle_liste', 'liste_to_use.cle_liste_id', '=', 'cle_liste.id')
      .join('users as creator', 'liste_to_use.created_by', '=', 'creator.id')
      .leftJoin('users as updater', 'liste_to_use.updated_by', '=', 'updater.id')
      .select(
        'liste_to_use.id',
        'liste_to_use.code',
        'liste_to_use.libelle',
        'cle_liste.libelle as usage',
        'creator.login as created_by_login',
        'updater.login as updated_by_login',
        'liste_to_use.created_at',
        'liste_to_use.updated_at',
      )
      .where('cle_liste.libelle', libelle)
      .orderBy('liste_to_use.code');

    res.status(200).json({
      status: 'success',
      results: listes.length,
      data: {
        libelle_cle: libelle,
        listes,
      },
    });
  } catch (error) {
    return next(new AppError('Erreur lors de la récupération des listes', 500));
  }
});

export default {
  createOrUpdateCleListe,
  createOrUpdateListeToUse,
  getAllCleListes,
  getAllListeToUse,
  getListeToUseByCle,
};
