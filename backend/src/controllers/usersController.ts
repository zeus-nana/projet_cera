import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import db from '../database/connection';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { signToken } from '../utils/tokens';

// Check if user already exists
// const checkUserEmailExists = async (email: string): Promise<boolean> => {
//   const user: User | undefined = await db('users').where({ email }).first();
//   return user !== undefined;
// };

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, currentPassword, newPassword } = req.body;

    console.log(userId);

    // 1) Get user from database
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return next(new AppError('Utilisateur non trouvé.', 404));
    }

    // 2) Check if current password is correct
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return next(new AppError('Le mot de passe actuel est incorrect.', 401));
    }

    // 3) Check if new password is different from old password
    const isNewPasswordDifferent = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (isNewPasswordDifferent) {
      return next(
        new AppError(
          "Le nouveau mot de passe doit être différent de l'ancien.",
          400,
        ),
      );
    }

    // 4) Validate new password
    if (!validator.isStrongPassword(newPassword)) {
      return next(
        new AppError("Le nouveau mot de passe n'est pas assez fort.", 400),
      );
    }

    // 5) Generate new token
    const newToken = signToken(user.id, user.email);
    res.cookie('jwt', newToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      ),

      secure: process.env.NODE_ENV === 'production',
    });

    // 6) Update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db('users')
      .where({ id: userId })
      .update({
        password: hashedNewPassword,
        must_reset_password: false,
        updated_by: req.user!.id,
      });

    res.status(200).json({
      status: 'succès',
      message: 'Mot de passe changé avec succès.',
      token: newToken,
    });
  },
);

export default {
  changePassword,
};
