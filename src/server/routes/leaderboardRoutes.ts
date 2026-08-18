import { Router } from 'express';
import { checkUserBadges, store } from '../db.js';

const router = Router();

// GET /api/leaderboard
router.get('/', (req, res) => {
  const users = store.users.map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    points: u.points,
    completedChallenges: u.completedChallenges,
    badges: checkUserBadges(u),
    role: u.role,
  }));

  users.sort((a, b) => b.points - a.points);
  return res.json(users);
});

export default router;
