import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import healthRoutes from './routes/healthRoutes';

const app: Application = express();

// Conectar a la base de datos
connectDatabase();

// Middlewares
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth Service API',
    version: '1.0.0',
    database: 'PostgreSQL',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/auth/profile'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
  console.log(`🐘 Base de datos: PostgreSQL`);
});

export default app;
