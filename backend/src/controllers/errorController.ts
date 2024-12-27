import { NextFunction, Request, Response } from 'express';
import { DatabaseError } from 'pg';

const handlePostgresError = (
  error: DatabaseError,
): { statusCode: number; message: string } => {
  switch (error.code) {
    case '23505': // unique_violation
      return {
        statusCode: 409,
        message: 'Duplicate key value violates unique constraint.',
      };
    case '23503': // foreign_key_violation
      return {
        statusCode: 400,
        message: 'Foreign key constraint violation.',
      };
    case '23502': // not_null_violation
      return { statusCode: 400, message: 'Not Null constraint violation.' };
    case '42P01': // undefined_table
      return {
        statusCode: 500,
        message: 'The specified table does not exist.',
      };
    case '42703': // undefined_column
      return {
        statusCode: 500,
        message: 'Undefined column..',
      };
    case '28P01': // invalid_password
      return {
        statusCode: 401,
        message: 'Cannot connect to database. Invalid password.',
      };
    case '53300': // too_many_connections
      return {
        statusCode: 503,
        message: 'Too many connections. Please try again later.',
      };
    case '22P02': // not an integer exception
      return {
        statusCode: 400,
        message: 'Not an integer exception.',
      };
    default:
      return {
        statusCode: 500,
        message: 'An database error has occurred.',
      };
  }
};

const sendErrorDev = (error: any, res: Response) => {
  console.error(error);
  // Gestion des erreurs de base de données PostgreSQL
  if (error instanceof DatabaseError) {
    console.error('Database Error:', error);
    const { statusCode, message } = handlePostgresError(error);
    return res.status(statusCode).json({
      status: 'Database error',
      message: message,
      error,
      stack: error.stack,
    });
  }

  // Gestion des erreurs de token
  if (error.name === 'JsonWebTokenError') {
    console.error('Joi Error:', error);
    return res.status(401).json({
      status: 'JWT error',
      message: error.message,
      error,
      stack: error.stack,
    });
  }

  return res.status(error.statusCode || 500).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: any, res: Response) => {
  if (error instanceof DatabaseError) {
    console.error('Database Error:', error);
    const { statusCode, message } = handlePostgresError(error);
    return res.status(statusCode).json({
      status: 'Database error',
      message: message,
    });
  }

  // Gestion des erreurs de token
  if (error.name === 'JsonWebTokenError') {
    console.error('Joi Error:', error);
    return res.status(401).json({
      status: 'JWT error',
      message: 'Invalid Token.',
    });
  }

  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', error);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

export = (error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};
