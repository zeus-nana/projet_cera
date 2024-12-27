import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import db from '../database/connection';
import { AgenceCreationAttributes, AgenceUpdateAttributes } from '../models/Agence';

const createOrUpdateAgence = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, code_agence, agence, gesuni, reseau, pole, type_agence, v_hv, telephone, commune_id } = req.body;

  // Vérification des champs obligatoires
  if (!code_agence || !agence || !gesuni || !reseau || !pole || !type_agence || !v_hv) {
    return next(
      new AppError('Les champs code_agence, agence, gesuni, reseau, pole, type_agence et v_hv sont obligatoires', 400),
    );
  }

  try {
    // Si commune_id est fourni, vérifier qu'elle existe
    if (commune_id) {
      const communeExists = await db('commune_arrondissement').where('id', commune_id).first();
      if (!communeExists) {
        return next(new AppError("La commune spécifiée n'existe pas", 400));
      }
    }

    if (id) {
      // Mise à jour
      const existingAgence = await db('agence').where('id', id).first();
      if (!existingAgence) {
        return next(new AppError('Agence non trouvée', 404));
      }

      // Vérifier l'unicité du code_agence
      const agenceWithSameCode = await db('agence').where('code_agence', code_agence).whereNot('id', id).first();
      if (agenceWithSameCode) {
        return next(new AppError('Une agence avec ce code existe déjà', 400));
      }

      // Vérifier l'unicité du nom d'agence
      const agenceWithSameName = await db('agence').where('agence', agence).whereNot('id', id).first();
      if (agenceWithSameName) {
        return next(new AppError('Une agence avec ce nom existe déjà', 400));
      }

      // Vérifier l'unicité du gesuni
      const agenceWithSameGesuni = await db('agence').where('gesuni', gesuni).whereNot('id', id).first();
      if (agenceWithSameGesuni) {
        return next(new AppError('Une agence avec ce code gesuni existe déjà', 400));
      }

      const updateData: AgenceUpdateAttributes = {
        code_agence,
        agence,
        gesuni,
        reseau,
        pole,
        type_agence,
        v_hv,
        telephone,
        commune_id,
        updated_by: req.user!.id,
      };

      const [updatedAgence] = await db('agence')
        .where('id', id)
        .update(updateData, [
          'id',
          'code_agence',
          'agence',
          'gesuni',
          'reseau',
          'pole',
          'type_agence',
          'v_hv',
          'telephone',
          'commune_id',
        ]);

      return res.status(200).json({
        status: 'success',
        data: {
          agence: updatedAgence,
        },
      });
    } else {
      // Création - Vérifier toutes les contraintes d'unicité
      const existingChecks = await db('agence')
        .where('code_agence', code_agence)
        .orWhere('agence', agence)
        .orWhere('gesuni', gesuni);

      if (existingChecks.length > 0) {
        const errors = [];
        for (const existing of existingChecks) {
          if (existing.code_agence === code_agence) {
            errors.push('code agence');
          }
          if (existing.agence === agence) {
            errors.push('nom agence');
          }
          if (existing.gesuni === gesuni) {
            errors.push('gesuni');
          }
        }
        return next(new AppError(`Les valeurs suivantes existent déjà : ${errors.join(', ')}`, 400));
      }

      const nouvelleAgence: AgenceCreationAttributes = {
        code_agence,
        agence,
        gesuni,
        reseau,
        pole,
        type_agence,
        v_hv,
        telephone,
        commune_id,
        created_by: req.user!.id,
        updated_by: req.user!.id,
      };

      const [createdAgence] = await db('agence').insert(nouvelleAgence, [
        'id',
        'code_agence',
        'agence',
        'gesuni',
        'reseau',
        'pole',
        'type_agence',
        'v_hv',
        'telephone',
        'commune_id',
      ]);

      return res.status(201).json({
        status: 'success',
        data: {
          agence: createdAgence,
        },
      });
    }
  } catch (error) {
    return next(new AppError("Erreur lors de la création ou mise à jour de l'agence", 500));
  }
});

const getAllAgences = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const agences = await db('agence')
    .leftJoin('users as creator', 'agence.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'agence.updated_by', '=', 'updater.id')
    .leftJoin('commune_arrondissement', 'agence.commune_id', '=', 'commune_arrondissement.id')
    .leftJoin('departement', 'commune_arrondissement.departement_id', '=', 'departement.id')
    .leftJoin('region', 'departement.region_id', '=', 'region.id')
    .select(
      'agence.*',
      'creator.login as created_by_login',
      'updater.login as updated_by_login',
      'commune_arrondissement.commune',
      'commune_arrondissement.arrondissement',
      'departement.departement',
      'region.region',
      'region.chef_lieu as region_chef_lieu',
    )
    .orderBy('agence.code_agence');

  res.status(200).json({
    status: 'success',
    results: agences.length,
    data: {
      agences,
    },
  });
});

const getAgenceByCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code_agence } = req.params;

  if (!code_agence) {
    return next(new AppError("Le code de l'agence est requis", 400));
  }

  try {
    const agence = await db('agence')
      .leftJoin('users as creator', 'agence.created_by', '=', 'creator.id')
      .leftJoin('users as updater', 'agence.updated_by', '=', 'updater.id')
      .leftJoin('commune_arrondissement', 'agence.commune_id', '=', 'commune_arrondissement.id')
      .leftJoin('departement', 'commune_arrondissement.departement_id', '=', 'departement.id')
      .leftJoin('region', 'departement.region_id', '=', 'region.id')
      .select(
        'agence.*',
        'creator.login as created_by_login',
        'updater.login as updated_by_login',
        'commune_arrondissement.commune as commune_nom',
        'commune_arrondissement.arrondissement',
        'departement.departement as departement_nom',
        'region.region as region_nom',
        'region.chef_lieu as region_chef_lieu',
      )
      .where('agence.code_agence', code_agence)
      .first();

    if (!agence) {
      return next(new AppError('Aucune agence trouvée avec ce code', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        agence,
      },
    });
  } catch (error) {
    return next(new AppError("Erreur lors de la récupération de l'agence", 500));
  }
});

const getAllLocalites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const localites = await db('commune_arrondissement')
    .join('departement', 'commune_arrondissement.departement_id', '=', 'departement.id')
    .join('region', 'departement.region_id', '=', 'region.id')
    .leftJoin('users as creator', 'commune_arrondissement.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'commune_arrondissement.updated_by', '=', 'updater.id')
    .select(
      'commune_arrondissement.id',
      'commune_arrondissement.commune',
      'commune_arrondissement.arrondissement',
      'departement.id as departement_id',
      'departement.departement',
      'region.id as region_id',
      'region.region',
      'region.chef_lieu',
    )
    .orderBy('region.region')
    .orderBy('departement.departement')
    .orderBy('commune_arrondissement.commune');

  // Regroupement des localités par région et département
  const transformedLocalites = localites.reduce((acc, localite) => {
    if (!acc[localite.region_id]) {
      acc[localite.region_id] = {
        id: localite.region_id,
        region: localite.region,
        chef_lieu: localite.chef_lieu,
        departements: {},
      };
    }

    if (!acc[localite.region_id].departements[localite.departement_id]) {
      acc[localite.region_id].departements[localite.departement_id] = {
        id: localite.departement_id,
        departement: localite.departement,
        commune_arrondissements: [],
      };
    }

    acc[localite.region_id].departements[localite.departement_id].commune_arrondissements.push({
      id: localite.id,
      commune: localite.commune,
      arrondissement: localite.arrondissement,
    });

    return acc;
  }, {});

  // Conversion de l'objet en tableau
  const regions = Object.values(transformedLocalites);

  res.status(200).json({
    status: 'success',
    results: regions.length,
    data: {
      regions,
    },
  });
});

export default {
  createOrUpdateAgence,
  getAllAgences,
  getAgenceByCode,
  getAllLocalites,
};
