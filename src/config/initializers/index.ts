import { loadEnvVars } from './envVars';
import initializeMigrations from './migrations';

export async function initialize() {
  loadEnvVars();
  await initializeMigrations();
}
