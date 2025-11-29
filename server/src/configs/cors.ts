import {
  NEXT_PUBLIC_API_PORT_CLIENTS,
  NEXT_PUBLIC_API_URL_CLIENTS,
} from '@/venv';
import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all origins in development
    return callback(null, true);

    /*
    const allowedOrigins = [
      NEXT_PUBLIC_API_URL_CLIENTS,
      `http://localhost:${NEXT_PUBLIC_API_PORT_CLIENTS}`,
    ];
    */
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
