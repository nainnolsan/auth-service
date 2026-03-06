import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AuthRequest, LoginData, RegisterData } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthController {
  // Registro de usuario
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password }: RegisterData = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Verificar si el usuario ya existe
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
        return;
      }

      // Crear nuevo usuario
      const user = userRepository.create({ name, email, password });
      await userRepository.save(user);

      // Generar tokens
      const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
      });
      const refreshToken = generateRefreshToken({ 
        userId: user.id, 
        email: user.email 
      });

      // Guardar refresh token
      user.refreshTokens.push(refreshToken);
      await userRepository.save(user);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginData = req.body;

      const userRepository = AppDataSource.getRepository(User);

      // Buscar usuario
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Generar tokens
      const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
      });
      const refreshToken = generateRefreshToken({ 
        userId: user.id, 
        email: user.email 
      });

      // Guardar refresh token
      user.refreshTokens.push(refreshToken);
      await userRepository.save(user);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requerido'
        });
        return;
      }

      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);

      const userRepository = AppDataSource.getRepository(User);

      // Buscar usuario y verificar que el token existe
      const user = await userRepository.findOne({ where: { id: decoded.userId } });
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        res.status(403).json({
          success: false,
          message: 'Refresh token inválido'
        });
        return;
      }

      // Generar nuevo access token
      const newAccessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
      });

      res.status(200).json({
        success: true,
        message: 'Token refrescado exitosamente',
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token requerido'
        });
        return;
      }

      // Verificar y decodificar el token
      const decoded = verifyRefreshToken(refreshToken);

      const userRepository = AppDataSource.getRepository(User);

      // Buscar usuario y remover el refresh token
      const user = await userRepository.findOne({ where: { id: decoded.userId } });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((token: string) => token !== refreshToken);
        await userRepository.save(user);
      }

      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
