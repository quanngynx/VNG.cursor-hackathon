import express, { Express, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { corsOptions } from './configs/cors';
import { requestLoggingMiddleware } from './middlewares/request-context.middleware';
import { v1Router } from './routes/router.v1';
import { BRAND_APP_NAME } from './venv';
import { initializeFirebase } from './configs/firebase';

export class App {
  public app: Express;

  constructor() {
    this.app = express();
  }

  public initialize(): void {
    this.initializeFirebase();
    this.initializeRoutes();
    this.initializeMiddlewares();
  }

  private initializeFirebase(): void {
    try {
      initializeFirebase();
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {
      res.status(200).json({ message: `[${BRAND_APP_NAME}] API is running` });
    });
    this.app.use('/api/v1', v1Router);
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors(corsOptions));

    // Compression and body parsing
    this.app.use(compression());
    this.app.use(json({ limit: '10mb' }));
    this.app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Request context and logging middleware
    this.app.use(requestLoggingMiddleware);
  }

  public listen(port: number): void {
    const server = this.app.listen(port, () => {
      console.log(`[${BRAND_APP_NAME}] running on port ${port}`);
      console.log(`[${BRAND_APP_NAME}] API Url: http://localhost:${port}`);
    });

    // Handle port conflicts with clear error message
    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error(`[${BRAND_APP_NAME}] Server error:`, error);
      if (error.code === 'EADDRINUSE') {
        console.error(`[${BRAND_APP_NAME}] Port ${port} is already in use.`);
        console.error(
          `[${BRAND_APP_NAME}] Please stop the existing server or kill the process using:`,
        );
        console.error(`   netstat -ano | findstr :${port}`);
        console.error(`   taskkill /PID <PID_NUMBER> /F`);
        process.exit(1);
      } else {
        console.error(`[${BRAND_APP_NAME}] Server error:`, error);
        process.exit(1);
      }
    });
  }
}
