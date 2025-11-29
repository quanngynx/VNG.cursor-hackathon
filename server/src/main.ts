import { App } from './app';

import { NEXT_PUBLIC_API_PORT_SERVER } from '@/venv';

const PORT = Number.parseInt(NEXT_PUBLIC_API_PORT_SERVER);

const app = new App();

const startServer = (): void => {
  try {
    app.initialize();
    app.listen(PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
