import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import db from '../database/connection';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import bcrypt from 'bcryptjs';
import { jwtVerify, signToken } from '../utils/tokens';
import validator from 'validator';

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { login, password } = req.body;
  // 1) Check if email and password exist
  console.log("credent :: ",login, password);

  console.log(process.env.FRONTEND_URL, " ::: front")

  if (!login || !password) {
    return next(new AppError('Please provide login and password!', 400));
  }
  // 2) Check if user exist && password is correct
  const user: User | undefined = await db('users').where({ login }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) Check if user is active
  if (!user.active) {
    return next(new AppError('This user is not active! Please contact support.', 401));
  }

  // 4) Check if user must reset password
  if (user.must_reset_password) {
    return res.status(200).json({
      status: 'success',
      message: 'User must reset password',
      user: {
        id: user.id,
        email: user.email,
        must_reset_password: user.must_reset_password,
      },
    });
  }

  // 5) If ok, send token to client
  const loggedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    department: user.department,
    must_reset_password: user.must_reset_password,
    profile: user.profile,
    created_at: user.created_at,
    authenticated: true,
  };

  const token = signToken(user.id, user.email);
  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
  });

  // console.log('res', res);

  res.status(200).json({
    status: 'success',
    token,
    user: loggedUser,
  });
});

const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get the token  and check if it exists
  let token;
  await new Promise((resolve) => setTimeout(resolve, 50));
  // Vérifier d'abord le cookie
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Garder la vérification de l'en-tête Authorization comme fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Accès interdit!', 401));
  }

  // 2) Token verification
  const decoded = await jwtVerify(token, process.env.JWT_SECRET!);

  // 3) Check if user still exists and is active
  const currentUser = await db('users').where({ id: decoded.id }).first();
  if (!currentUser) {
    return next(new AppError('User does  not exist', 401));
  }
  if (!currentUser.active) {
    return next(new AppError("Ce compte est désactivé, contactez l'administrateur !", 401));
  }

  // 4) Check if user record has been updated after token was issued
  if (currentUser.updated_at.getTime() > decoded.iat * 1000 + 10000) {
    return next(new AppError('Le compte a été mis a jour', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  currentUser.authenticated = true;
  req.user = currentUser;
  next();
});

const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // if (!roles.includes(req.user?.role!)) {
    //   return next(
    //     new AppError('You do not have permission to perform this action', 403),
    //   );
    // }
    next();
  };
};

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('idi');

  // Clear the JWT cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, newPassword } = req.body;
  const id = userId;
  console.log(newPassword, id);

  // Valider le nouveau mot de passe
  if (
    !validator.isStrongPassword(newPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return next(
      new AppError(
        "Le mot de passe n'est pas assez fort. Il doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un symbole.",
        400,
      ),
    );
  }

  // Hacher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Mettre à jour le mot de passe dans la base de données
  await db('users').where({ id }).update({
    password: hashedPassword,
    must_reset_password: false, // Réinitialiser le flag must_reset_password
  });

  // Récupérer les informations mises à jour de l'utilisateur
  const updatedUser = await db('users')
    .where({ id })
    .first('id', 'username', 'email', 'phone', 'department', 'localisation', 'profile', 'created_at');

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  // Générer un nouveau token JWT
  const token = signToken(updatedUser.id, updatedUser.email);

  // Définir le nouveau cookie JWT
  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
  });

  // Renvoyer les informations complètes de l'utilisateur
  res.status(200).json({
    status: 'succès',
    message: 'Mot de passe mis à jour.',
    user: updatedUser,
  });
});

const verifyToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get the token from the cookie
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError('No token found', 401));
  }

  // 2) Verify the token
  const decoded = await jwtVerify(token, process.env.JWT_SECRET!);

  // 3) Check if user still exists
  const currentUser = await db('users').where({ id: decoded.id }).first();

  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  // 4) Check if user is still active
  if (!currentUser.active) {
    return next(new AppError('User account is not active', 401));
  }

  // 5) If everything ok, send user data
  const userData = {
    id: currentUser.id,
    username: currentUser.username,
    email: currentUser.email,
    phone: currentUser.phone,
    department: currentUser.department,
    profile: currentUser.profile,
    localisation: currentUser.localisation,
    created_at: currentUser.created_at,
  };

  res.status(200).json({
    status: 'success',
    user: userData,
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Récupérer l'utilisateur à partir de la requête
  const user = req.user;
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Renvoyer les informations de l'utilisateur
  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      department: user.department,
      profile: user.profile,
      localisation: user.localisation,
      created_at: user.created_at,
      authenticated: user.authenticated,
    },
  });
});

export default {
  login,
  protect,
  restrictTo,
  logout,
  changePassword,
  verifyToken,
  getCurrentUser,
};
