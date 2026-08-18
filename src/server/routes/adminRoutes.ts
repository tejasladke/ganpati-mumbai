import { Router } from 'express';
import { AdminStats } from '../../types.js';
import { adminOnly, authMiddleware } from '../auth.js';
import { store } from '../db.js';

const router = Router();

// POST /api/admin/verify-password
router.post('/verify-password', authMiddleware, (req: any, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Admin password is required' });
  }

  // Admin password check ('admin123')
  if (password === 'admin123') {
    if (req.user) {
      req.user.role = 'admin';
    }
    return res.json({ success: true, message: 'Admin password verified. Admin privileges granted!', user: req.user });
  } else {
    return res.status(401).json({ message: 'Incorrect admin password' });
  }
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, adminOnly, (req, res) => {
  const pendingSubmissions = store.submissions.filter((s) => s.status === 'Pending').length;
  const approvedSubmissions = store.submissions.filter((s) => s.status === 'Approved').length;
  const totalPointsAwarded = store.users.reduce((acc, u) => acc + u.points, 0);

  const stats: AdminStats = {
    totalUsers: store.users.length,
    totalPandals: store.pandals.length,
    totalChallenges: store.challenges.length,
    pendingSubmissions,
    approvedSubmissions,
    totalPointsAwarded,
  };

  return res.json(stats);
});

// GET /api/admin/users
router.get('/users', authMiddleware, adminOnly, (req, res) => {
  const safeUsers = store.users.map(({ id, name, email, avatar, role, points, completedChallenges, badges, createdAt }) => ({
    id,
    name,
    email,
    avatar,
    role,
    points,
    completedChallenges,
    badges,
    createdAt,
  }));
  return res.json(safeUsers);
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', authMiddleware, adminOnly, (req, res) => {
  const { role } = req.body;
  const user = store.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ message: 'Role must be user or admin' });
  }

  user.role = role;
  return res.json({ message: `User role updated to ${role}`, user });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authMiddleware, adminOnly, (req, res) => {
  const index = store.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deleted = store.users.splice(index, 1)[0];
  if (deleted.email) {
    delete store.passwords[deleted.email];
  }

  return res.json({ message: 'User deleted successfully', userId: req.params.id });
});

export default router;
