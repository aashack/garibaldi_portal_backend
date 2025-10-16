import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createProfileForUser,
  getOrCreateProfileForUser,
  getProfileByUserId,
  updateProfileForUser,
} from '../controller/profileController';

const router = Router();

// All routes below require JWT auth
router.use(requireAuth);

// GET /api/profile -> fetch current user's profile
router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = await getProfileByUserId(userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
});

// POST /api/profile -> create profile for current user
router.post('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const created = await createProfileForUser(userId, req.body);
  if (!created) return res.status(409).json({ error: 'Profile already exists' });
  res.status(201).json(created);
});

// POST /api/profile/initialize -> idempotent: create empty profile if not exists
router.post('/initialize', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { profile, created } = await getOrCreateProfileForUser(userId);
  return res.status(created ? 201 : 200).json(profile);
});

// PUT /api/profile -> update profile fields
router.put('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const updated = await updateProfileForUser(userId, req.body);
  if (!updated) return res.status(404).json({ error: 'Profile not found' });
  res.json(updated);
});

export default router;
