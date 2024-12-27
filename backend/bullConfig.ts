// bullConfig.ts
import Queue from 'bull';

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'redis', // Utilise le nom du service Docker
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};

// Configuration de la file avec un limiteur
export const fileProcessingQueue = new Queue('fileProcessing', {
  ...redisConfig,
  limiter: {
    max: 10, // Nombre maximum de jobs traités
    duration: 60000,
  },
});

export const defaultJobOptions: Queue.JobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};