import { Router } from 'express';

// ROUTES FOR THE APP
const router: Router = Router();

// Check hello world
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

export { router as v1Router };
