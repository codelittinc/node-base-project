import { applyConfig } from './config'
import { getApp } from './server'

export function start() {
  applyConfig();

  const app = getApp();

  const { SERVER_PORT } = process.env;

  const PORT = SERVER_PORT || 9090;

  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}