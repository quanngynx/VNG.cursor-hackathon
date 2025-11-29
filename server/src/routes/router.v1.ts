import { Router } from 'express';
import { foodLogRouter } from './food-log.routes';
import { userRouter } from './user.routes';

// ROUTES FOR THE APP
const router: Router = Router();

// Check hello world
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

// User routes
router.use(userRouter);

// Food log routes
router.use(foodLogRouter);

export { router as v1Router };
