import { Router } from 'express';
import { foodLogRouter } from './food-log.routes';

// ROUTES FOR THE APP
const router: Router = Router();

// Check hello world
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

// Food log routes
router.use('/food-logs', foodLogRouter);

export { router as v1Router };
