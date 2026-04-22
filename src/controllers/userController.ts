import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AuthRequest } from '../types'; // Assuming it exists

const userRepository = AppDataSource.getRepository(User);

export const updateScrapingPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      return;
    }

    const { preferences } = req.body;
    
    if (!Array.isArray(preferences)) {
      res.status(400).json({ success: false, message: 'preferences debe ser un arreglo' });
      return;
    }

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    user.scrapingPreferences = preferences;
    await userRepository.save(user);

    res.json({ success: true, message: 'Preferencias guardadas exitosamente', data: user.scrapingPreferences });
  } catch (error: any) {
    console.error('Error in updateScrapingPreferences:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const getAllScrapingPreferences = async (req: Request, res: Response): Promise<void> => {
   try {
     // NOTE: This endpoint should ideally be protected by a microservice API Key in production
     const users = await userRepository.find({
       select: ['id', 'scrapingPreferences']
     });
     
     const allPreferences = users.map(u => ({
       userId: u.id,
       preferences: u.scrapingPreferences || []
     }));

     res.json({ success: true, data: allPreferences });
   } catch (error: any) {
     console.error('Error in getAllScrapingPreferences:', error);
     res.status(500).json({ success: false, message: 'Error interno del servidor' });
   }
};
