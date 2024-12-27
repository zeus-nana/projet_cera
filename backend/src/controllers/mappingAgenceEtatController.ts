import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import db from '../database/connection';

interface MappingAgenceEtatCreate {
  agence_id: number;
  etat_id: number;
  identifiant: string;
  active?: boolean;
  created_by: number;
  updated_by: number;
}

const createOrUpdateMappingAgenceEtat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, agence_id, etat_id, identifiant, active = true } = req.body;

  // Vérification des champs obligatoires
  if (!agence_id || !etat_id || !identifiant) {
    return next(new AppError("L'identifiant de l'agence, l'état et l'identifiant sont requis", 400));
  }

  try {
    // Vérifier que l'agence existe
    const agenceExists = await db('agence').where('id', agence_id).first();
    if (!agenceExists) {
      return next(new AppError("L'agence spécifiée n'existe pas", 400));
    }

    // Vérifier que l'état existe
    const etatExists = await db('etat').where('id', etat_id).first();
    if (!etatExists) {
      return next(new AppError("L'état spécifié n'existe pas", 400));
    }

    // Vérifier si l'identifiant est déjà actif pour cet état
    const activeMapping = await db('mapping_agence_etat')
      .where({
        etat_id,
        identifiant,
        active: true,
      })
      .whereNot('id', id || 0) // Exclure l'enregistrement actuel si c'est une mise à jour
      .first();

    if (id) {
      // Mise à jour
      const existingMapping = await db('mapping_agence_etat').where('id', id).first();

      if (!existingMapping) {
        return next(new AppError('Mapping non trouvé', 404));
      }

      // Si on essaie d'activer le mapping
      if (active) {
        if (activeMapping) {
          return next(
            new AppError(
              `Cet identifiant est déjà actif pour cet état avec l'agence ${activeMapping.agence_id}. 
              Veuillez d'abord le désactiver avant de l'assigner à une autre agence.`,
              400,
            ),
          );
        }
      }

      const [updatedMapping] = await db('mapping_agence_etat').where('id', id).update(
        {
          agence_id,
          etat_id,
          identifiant,
          active,
          updated_by: req.user!.id,
        },
        ['id', 'agence_id', 'etat_id', 'identifiant', 'active', 'created_at', 'updated_at'],
      );

      return res.status(200).json({
        status: 'success',
        data: {
          mapping: updatedMapping,
        },
      });
    } else {
      // Création
      if (active && activeMapping) {
        return next(
          new AppError(
            `Cet identifiant est déjà actif pour cet état avec l'agence ${activeMapping.agence_id}. 
            Veuillez d'abord le désactiver avant de l'assigner à une autre agence.`,
            400,
          ),
        );
      }

      const newMapping: MappingAgenceEtatCreate = {
        agence_id,
        etat_id,
        identifiant,
        active,
        created_by: req.user!.id,
        updated_by: req.user!.id,
      };

      const [createdMapping] = await db('mapping_agence_etat').insert(newMapping, [
        'id',
        'agence_id',
        'etat_id',
        'identifiant',
        'active',
        'created_at',
        'updated_at',
      ]);

      return res.status(201).json({
        status: 'success',
        data: {
          mapping: createdMapping,
        },
      });
    }
  } catch (error) {
    return next(new AppError('Erreur lors de la création ou mise à jour du mapping', 500));
  }
});

const toggleMappingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { active } = req.body;

  if (active === undefined) {
    return next(new AppError('Le statut (active) est requis', 400));
  }

  try {
    const mapping = await db('mapping_agence_etat').where('id', id).first();

    if (!mapping) {
      return next(new AppError('Mapping non trouvé', 404));
    }

    // Si on essaie d'activer, vérifier qu'aucun autre mapping n'est actif pour cet identifiant et état
    if (active) {
      const activeMapping = await db('mapping_agence_etat')
        .where({
          etat_id: mapping.etat_id,
          identifiant: mapping.identifiant,
          active: true,
        })
        .whereNot('id', id)
        .first();

      if (activeMapping) {
        return next(
          new AppError(
            `Cet identifiant est déjà actif pour cet état avec l'agence ${activeMapping.agence_id}. 
            Veuillez d'abord le désactiver avant de l'activer pour une autre agence.`,
            400,
          ),
        );
      }
    }

    const [updatedMapping] = await db('mapping_agence_etat').where('id', id).update(
      {
        active,
        updated_by: req.user!.id,
      },
      ['id', 'agence_id', 'etat_id', 'identifiant', 'active', 'updated_at'],
    );

    res.status(200).json({
      status: 'success',
      data: {
        mapping: updatedMapping,
      },
    });
  } catch (error) {
    return next(new AppError('Erreur lors de la modification du statut du mapping', 500));
  }
});

const getMappingsByAgence = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { agence_id } = req.params;

  if (!agence_id) {
    return next(new AppError("L'identifiant de l'agence est requis", 400));
  }

  try {
    const mappings = await db('mapping_agence_etat')
      .join('agence', 'mapping_agence_etat.agence_id', '=', 'agence.id')
      .join('etat', 'mapping_agence_etat.etat_id', '=', 'etat.id')
      .join('users as creator', 'mapping_agence_etat.created_by', '=', 'creator.id')
      .leftJoin('users as updater', 'mapping_agence_etat.updated_by', '=', 'updater.id')
      .select(
        'mapping_agence_etat.*',
        'agence.code_agence',
        'agence.agence as nom_agence',
        'etat.etat as nom_etat',
        'creator.login as created_by_login',
        'updater.login as updated_by_login',
      )
      .where('mapping_agence_etat.agence_id', agence_id)
      .orderBy(['etat.etat', 'mapping_agence_etat.identifiant']);

    res.status(200).json({
      status: 'success',
      results: mappings.length,
      data: {
        mappings,
      },
    });
  } catch (error) {
    return next(new AppError('Erreur lors de la récupération des mappings', 500));
  }
});

const getMappingsByEtat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { etat_id } = req.params;

  if (!etat_id) {
    return next(new AppError("L'identifiant de l'état est requis", 400));
  }

  try {
    const mappings = await db('mapping_agence_etat')
      .join('agence', 'mapping_agence_etat.agence_id', '=', 'agence.id')
      .join('etat', 'mapping_agence_etat.etat_id', '=', 'etat.id')
      .join('users as creator', 'mapping_agence_etat.created_by', '=', 'creator.id')
      .leftJoin('users as updater', 'mapping_agence_etat.updated_by', '=', 'updater.id')
      .select(
        'mapping_agence_etat.*',
        'agence.code_agence',
        'agence.agence as nom_agence',
        'etat.etat as nom_etat',
        'creator.login as created_by_login',
        'updater.login as updated_by_login',
      )
      .where('mapping_agence_etat.etat_id', etat_id)
      .orderBy(['agence.code_agence', 'mapping_agence_etat.identifiant']);

    res.status(200).json({
      status: 'success',
      results: mappings.length,
      data: {
        mappings,
      },
    });
  } catch (error) {
    return next(new AppError('Erreur lors de la récupération des mappings', 500));
  }
});

export default {
  createOrUpdateMappingAgenceEtat,
  getMappingsByAgence,
  getMappingsByEtat,
  toggleMappingStatus,
};
