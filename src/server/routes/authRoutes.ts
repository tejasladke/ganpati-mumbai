import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { User } from '../../types.js';
import { AuthRequest, authMiddleware, generateToken } from '../auth.js';
import { checkUserBadges, store } from '../db.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'user',
      points: 50, // Welcome bonus
      completedChallenges: 0,
      badges: ['Bappa Devotee'],
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    store.passwords[newUser.email] = hashedPassword;

    const token = generateToken(newUser);
    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const storedHash = store.passwords[user.email];
    if (!storedHash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Failed to authenticate user' });
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  return res.json(req.user);
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const { name, avatar } = req.body;
  const user = store.users.find((u) => u.id === req.user!.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  user.badges = checkUserBadges(user);

  return res.json(user);
});

export default router;
