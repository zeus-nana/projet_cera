import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import db from '../database/connection';
import { MenuCreate } from '../models/Menu';
import { PermissionCreate } from '../models/Permission';
import { FonctionCreate } from '../models/Fonction';
import { FonctionMenuPermissionCreate } from '../models/Fonction_menu_permission';
import { UserFonctionCreate } from '../models/UserFonction';

const createOrUpdateMenu = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, nom, description } = req.body;

  if (!nom) {
    return res.status(400).json({
      status: 'échec',
      message: 'Le nom du menu est requis',
    });
  }

  try {
    if (id) {
      const existingMenu = await db('menu').where('id', id).first();
      if (!existingMenu) {
        return res.status(404).json({
          status: 'échec',
          message: 'Menu non trouvé',
        });
      }

      const menuWithSameName = await db('menu').where('nom', nom).whereNot('id', id).first();
      if (menuWithSameName) {
        return res.status(400).json({
          status: 'échec',
          message: 'Un menu avec ce nom existe déjà',
        });
      }

      const [updatedMenu] = await db('menu').where('id', id).update(
        {
          nom,
          description,
          updated_by: req.user!.id,
        },
        ['id', 'nom', 'description'],
      );

      return res.status(200).json({
        status: 'succès',
        data: {
          menu: updatedMenu,
        },
      });
    } else {
      const existingMenu = await db('menu').where('nom', nom).first();
      if (existingMenu) {
        return res.status(400).json({
          status: 'échec',
          message: 'Un menu avec ce nom existe déjà',
        });
      }

      const nouveauMenu: MenuCreate = {
        nom,
        description,
        created_by: req.user!.id,
      };

      const [createdMenu] = await db('menu').insert(nouveauMenu, ['id', 'nom', 'description']);

      return res.status(201).json({
        status: 'succès',
        data: {
          menu: createdMenu,
        },
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création ou mise à jour du menu:', error);
    return res.status(500).json({
      status: 'échec',
      message: 'Erreur lors de la création ou mise à jour du menu',
    });
  }
});

const createOrUpdateFonction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, nom, description } = req.body;

  if (!nom) {
    return res.status(400).json({
      status: 'échec',
      message: 'Le nom de la fonction est requis',
    });
  }

  try {
    if (id) {
      const existingFonction = await db('fonction').where('id', id).first();
      if (!existingFonction) {
        return res.status(404).json({
          status: 'échec',
          message: 'Fonction non trouvée',
        });
      }

      const fonctionWithSameName = await db('fonction').where('nom', nom).whereNot('id', id).first();
      if (fonctionWithSameName) {
        return res.status(400).json({
          status: 'échec',
          message: 'Une fonction avec ce nom existe déjà',
        });
      }

      const [updatedFonction] = await db('fonction').where('id', id).update(
        {
          nom,
          description,
          updated_by: req.user!.id,
        },
        ['id', 'nom', 'description'],
      );

      return res.status(200).json({
        status: 'succès',
        data: {
          fonction: updatedFonction,
        },
      });
    } else {
      const existingFonction = await db('fonction').where('nom', nom).first();
      if (existingFonction) {
        console.log('ici');
        return res.status(400).json({
          status: 'échec',
          message: 'Une fonction avec ce nom existe déjà',
        });
      }

      const nouvelleFonction: FonctionCreate = {
        nom,
        description,
        created_by: req.user!.id,
      };

      const [createdFonction] = await db('fonction').insert(nouvelleFonction, ['id', 'nom', 'description']);

      return res.status(201).json({
        status: 'succès',
        data: {
          fonction: createdFonction,
        },
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création ou mise à jour de la fonction:', error);
    return res.status(500).json({
      status: 'échec',
      message: 'Erreur lors de la création ou mise à jour de la fonction',
    });
  }
});

const createOrUpdatePermission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, nom, description, menu_id } = req.body;

  if (!nom || !menu_id) {
    return res.status(400).json({
      status: 'échec',
      message: 'Le nom et le menu sont requis',
    });
  }

  try {
    if (id) {
      const existingPermission = await db('permission').where('id', id).first();
      if (!existingPermission) {
        return res.status(404).json({
          status: 'échec',
          message: 'Permission non trouvée',
        });
      }

      const permissionWithSameName = await db('permission').where('nom', nom).whereNot('id', id).first();
      if (permissionWithSameName) {
        return res.status(400).json({
          status: 'échec',
          message: 'Une permission avec ce nom existe déjà',
        });
      }

      const [updatedPermission] = await db('permission').where('id', id).update(
        {
          nom,
          description,
          menu_id,
          updated_by: req.user!.id,
        },
        ['id', 'nom', 'description', 'menu_id'],
      );

      return res.status(200).json({
        status: 'succès',
        data: {
          permission: updatedPermission,
        },
      });
    } else {
      const existingPermission = await db('permission').where('nom', nom).first();
      if (existingPermission) {
        return res.status(400).json({
          status: 'échec',
          message: 'Une permission avec ce nom existe déjà',
        });
      }

      const nouvellePermission: PermissionCreate = {
        nom,
        description,
        menu_id,
        created_by: req.user!.id,
      };

      const [createdPermission] = await db('permission').insert(nouvellePermission, [
        'id',
        'nom',
        'description',
        'menu_id',
      ]);

      return res.status(201).json({
        status: 'succès',
        data: {
          permission: createdPermission,
        },
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création ou mise à jour de la permission:', error);
    return res.status(500).json({
      status: 'échec',
      message: 'Erreur lors de la création ou mise à jour de la permission',
    });
  }
});

const createFonctionMenuPermission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { fonction_id, menu_id, permission_ids } = req.body;

  // Validation de base
  if (!fonction_id || !menu_id || !Array.isArray(permission_ids) || permission_ids.length === 0) {
    return res.status(400).json({
      status: 'échec',
      message: 'Les IDs de fonction, menu et au moins une permission sont requis',
    });
  }

  try {
    // Vérification de l'existence de la fonction
    const fonction = await db('fonction').where({ id: fonction_id }).first();
    if (!fonction) {
      return res.status(400).json({
        status: 'échec',
        message: "La fonction spécifiée n'existe pas",
      });
    }

    // Vérification de l'existence du menu
    const menu = await db('menu').where({ id: menu_id }).first();
    if (!menu) {
      return res.status(400).json({
        status: 'échec',
        message: "Le menu spécifié n'existe pas",
      });
    }

    // Vérification de l'existence des permissions
    const existingPermissions = await db('permission').whereIn('id', permission_ids);
    if (existingPermissions.length !== permission_ids.length) {
      return res.status(400).json({
        status: 'échec',
        message: "Une ou plusieurs permissions spécifiées n'existent pas",
      });
    }

    const insertedPermissions: number[] = [];
    const alreadyExistingPermissions: number[] = [];

    for (const permission_id of permission_ids) {
      // Vérification si l'association existe déjà
      const existingAssociation = await db('fonction_menu_permission')
        .where({ fonction_id, menu_id, permission_id })
        .first();

      if (existingAssociation) {
        alreadyExistingPermissions.push(permission_id);
      } else {
        const nouvelleFonctionMenuPermission: FonctionMenuPermissionCreate = {
          fonction_id,
          menu_id,
          permission_id,
          created_by: req.user!.id,
        };

        const [newAssociation] = await db('fonction_menu_permission').insert(nouvelleFonctionMenuPermission, [
          'id',
          'fonction_id',
          'menu_id',
          'permission_id',
        ]);

        insertedPermissions.push(newAssociation.permission_id);
      }
    }

    res.status(201).json({
      status: 'succès',
      data: {
        insertedPermissions,
        alreadyExistingPermissions,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création des liaisons fonction-menu-permissions:', error);
    return next(new AppError('Erreur lors de la création des liaisons fonction-menu-permissions', 500));
  }
});

const getAllMenus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const menus = await db('menu')
    .join('users', 'menu.created_by', '=', 'users.id')
    .select('menu.*', 'users.login as created_by');

  res.status(200).json({
    status: 'succès',
    data: {
      menus,
    },
  });
});

const getAllPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const permissions = await db('permission')
    .join('users', 'permission.created_by', '=', 'users.id')
    .join('menu', 'permission.menu_id', '=', 'menu.id')
    .select('permission.*', 'users.login as created_by', 'menu.nom as menu');

  console.log(permissions);

  res.status(200).json({
    status: 'succès',
    data: {
      permissions,
    },
  });
});

const getAllFonctions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fonctions = await db('fonction')
    .join('users', 'fonction.created_by', '=', 'users.id')
    .select('fonction.*', 'users.login as created_by');

  console.log(fonctions);

  res.status(200).json({
    status: 'succès',
    data: {
      fonctions,
    },
  });
});

const getAllFonctionMenuPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fonctionMenuPermissions = await db('fonction_menu_permission')
    .join('fonction', 'fonction_menu_permission.fonction_id', '=', 'fonction.id')
    .join('menu', 'fonction_menu_permission.menu_id', '=', 'menu.id')
    .join('permission', 'fonction_menu_permission.permission_id', '=', 'permission.id')
    .join('users as creator', 'fonction_menu_permission.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'fonction_menu_permission.updated_by', '=', 'updater.id')
    .select(
      'fonction_menu_permission.id',
      'fonction.nom as fonction',
      'menu.nom as menu',
      'permission.nom as permission',
      'creator.username as created_by',
      'updater.username as updated_by',
      'fonction_menu_permission.created_at',
    );

  res.status(200).json({
    status: 'succès',
    data: {
      fonctionMenuPermissions,
    },
  });
});

const getAllUserFonctions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userFonctions = await db('user_fonction')
    .join('users as u', 'user_fonction.user_id', '=', 'u.id')
    .join('fonction as f', 'user_fonction.fonction_id', '=', 'f.id')
    .join('users as creator', 'user_fonction.created_by', '=', 'creator.id')
    .leftJoin('users as updater', 'user_fonction.updated_by', '=', 'updater.id')
    .select(
      'user_fonction.id',
      'user_fonction.user_id',
      'user_fonction.fonction_id',
      'u.login as login',
      'f.nom as fonction',
      'user_fonction.active',
      'user_fonction.created_by',
      'user_fonction.updated_by',
      'creator.login as created_by',
      'updater.login as updated_by',
      'user_fonction.created_at',
      'user_fonction.updated_at',
    );

  console.log(userFonctions);

  res.status(200).json({
    status: 'succès',
    data: {
      userFonctions,
    },
  });
});

const createUserFonction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, fonction_id } = req.body;

  // Validation de base
  if (!user_id || !fonction_id) {
    return res.status(400).json({
      status: 'échec',
      message: 'Les IDs utilisateur et fonction sont requis',
    });
  }

  try {
    // Vérification de l'existence de l'utilisateur
    const user = await db('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(400).json({
        status: 'échec',
        message: "L'utilisateur spécifié n'existe pas",
      });
    }

    // Vérification de l'existence de la fonction
    const fonction = await db('fonction').where({ id: fonction_id }).first();
    if (!fonction) {
      return res.status(400).json({
        status: 'échec',
        message: "La fonction spécifiée n'existe pas",
      });
    }

    // Vérification si l'attribution existe déjà
    const existingAttribution = await db('user_fonction')
      .where({
        user_id,
        fonction_id,
        active: true,
      })
      .first();

    if (existingAttribution) {
      return res.status(400).json({
        status: 'échec',
        message: 'Fonction déjà attribuée à cet utilisateur',
      });
    }

    const nouvelleUserFonction: UserFonctionCreate = {
      user_id,
      fonction_id,
      created_by: req.user!.id,
      active: true,
    };

    const [createdUserFonction] = await db('user_fonction').insert(nouvelleUserFonction, [
      'id',
      'user_id',
      'fonction_id',
      'active',
      'created_at',
    ]);

    res.status(201).json({
      status: 'succès',
      data: {
        userFonction: createdUserFonction,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'attribution de la fonction:", error);
    return next(new AppError("Erreur lors de l'attribution de la fonction", 500));
  }
});

const disableUserFonction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  console.log('ici');

  try {
    // Vérification de l'existence de l'attribution
    const existingAttribution = await db('user_fonction').where({ id }).first();

    if (!existingAttribution) {
      return res.status(404).json({
        status: 'échec',
        message: "L'attribution de fonction spécifiée n'existe pas",
      });
    }

    // Désactivation de l'attribution
    const [updatedUserFonction] = await db('user_fonction').where({ id }).update(
      {
        active: false,
        updated_by: req.user!.id,
      },
      ['id', 'user_id', 'fonction_id', 'active', 'updated_at'],
    );

    res.status(200).json({
      status: 'succès',
      data: {
        userFonction: updatedUserFonction,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la désactivation de l'attribution:", error);
    return next(new AppError("Erreur lors de la désactivation de l'attribution", 500));
  }
});

const updateUserFonctionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, action } = req.body;

  if (!id || !action) {
    return res.status(400).json({
      status: 'échec',
      message: 'Id et action sont requis',
    });
  }

  const active = action === 'enable' ? true : false;

  try {
    // Vérification de l'existence de l'attribution
    const existingAttribution = await db('user_fonction').where({ id }).first();

    if (!existingAttribution) {
      return res.status(404).json({
        status: 'échec',
        message: "L'attribution de fonction spécifiée n'existe pas",
      });
    }

    // Mise à jour de l'attribution
    const [updatedUserFonctionStatus] = await db('user_fonction').where({ id }).update(
      {
        active,
        updated_by: req.user!.id,
      },
      ['id', 'user_id', 'fonction_id', 'active', 'updated_at'],
    );

    res.status(200).json({
      status: 'succès',
      data: {
        userFonction: updatedUserFonctionStatus,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'attribution:", error);
    return next(new AppError("Erreur lors de la mise à jour de l'attribution", 500));
  }
});

export default {
  createOrUpdatePermission,
  createFonctionMenuPermission,
  getAllMenus,
  getAllPermissions,
  getAllFonctions,
  getAllFonctionMenuPermissions,
  createOrUpdateMenu,
  createOrUpdateFonction,
  getAllUserFonctions,
  createUserFonction,
  disableUserFonction,
  updateUserFonctionStatus,
};
