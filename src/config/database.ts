import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../models/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url, // Railway usa DATABASE_URL
  host: config.database.url ? undefined : config.database.host,
  port: config.database.url ? undefined : config.database.port,
  username: config.database.url ? undefined : config.database.username,
  password: config.database.url ? undefined : config.database.password,
  database: config.database.url ? undefined : config.database.database,
  synchronize: true, // Crear tablas automáticamente (cambiar a false después del primer deploy)
  logging: config.nodeEnv === 'development',
  entities: [User],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ PostgreSQL conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.destroy();
    console.log('🔌 PostgreSQL desconectado');
  } catch (error) {
    console.error('❌ Error desconectando PostgreSQL:', error);
  }
};
