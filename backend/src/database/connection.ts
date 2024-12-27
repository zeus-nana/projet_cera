import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

import knexfile from '../../knexfile';

dotenv.config();

// Environment set by the config.env file at the root of the system.
const environment: string = String(process.env.NODE_ENV);

let db: Knex<any, unknown[]>;

// Specification of the environment to set the database to work with.
if (environment === 'development') db = knex(knexfile.development);
else if (environment === 'staging') db = knex(knexfile.staging);
else db = knex(knexfile.production);

export default db;
