import { Router } from 'express';
import { Favorite } from '../../types.js';
import { AuthRequest, authMiddleware } from '../auth.js';
import { store } from '../db.js';

const router = Router();

// GET /api/favorites
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const userFavs = store.favorites.filter((f) => f.userId === user.id);
  const pandalIds = userFavs.map((f) => f.pandalId);
  const favoritePandals = store.pandals.filter((p) => pandalIds.includes(p.id));
  return res.json(favoritePandals);
});

// POST /api/favorites/:pandalId
router.post('/:pandalId', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const { pandalId } = req.params;

  const exists = store.favorites.some((f) => f.userId === user.id && f.pandalId === pandalId);
  if (exists) {
    return res.status(400).json({ message: 'Pandal is already in favorites' });
  }

  const pandal = store.pandals.find((p) => p.id === pandalId);
  if (!pandal) {
    return res.status(404).json({ message: 'Pandal not found' });
  }

  const fav: Favorite = {
    id: `fav-${Date.now()}`,
    userId: user.id,
    pandalId,
    createdAt: new Date().toISOString(),
  };

  store.favorites.push(fav);
  return res.status(201).json({ message: 'Added to favorites', pandalId });
});

// DELETE /api/favorites/:pandalId
router.delete('/:pandalId', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const { pandalId } = req.params;

  const index = store.favorites.findIndex((f) => f.userId === user.id && f.pandalId === pandalId);
  if (index === -1) {
    return res.status(404).json({ message: 'Favorite not found' });
  }

  store.favorites.splice(index, 1);
  return res.json({ message: 'Removed from favorites', pandalId });
});

export default router;
