import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Error de Mongoose - validación
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }))
    });
    return;
  }

  // Error de Mongoose - duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    res.status(409).json({
      success: false,
      message: `El ${field} ya está registrado`
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
    return;
  }

  // Error genérico
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
};
