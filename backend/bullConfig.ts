import Queue from 'bull';

const redisConfig = {
  redis: {
    host: 'localhost',
    port: 6379,
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
