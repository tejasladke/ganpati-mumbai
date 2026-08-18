import { Router } from 'express';
import { Challenge } from '../../types.js';
import { adminOnly, authMiddleware } from '../auth.js';
import { store } from '../db.js';

const router = Router();

// GET /api/challenges
router.get('/', (req, res) => {
  return res.json(store.challenges);
});

// GET /api/challenges/:id
router.get('/:id', (req, res) => {
  const challenge = store.challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }
  return res.json(challenge);
});

// POST /api/challenges (Admin)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, description, image, pandalId, latitude, longitude, points, difficulty, deadline } = req.body;

    if (!title || !description || !points) {
      return res.status(400).json({ message: 'Title, description, and points are required' });
    }

    let pandalName = '';
    if (pandalId) {
      const p = store.pandals.find((p) => p.id === pandalId);
      if (p) pandalName = p.name;
    }

    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title,
      description,
      image: image || 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      pandalId,
      pandalName,
      latitude: latitude !== undefined ? Number(latitude) : 18.9912,
      longitude: longitude !== undefined ? Number(longitude) : 72.8385,
      points: Number(points),
      difficulty: difficulty || 'Medium',
      deadline: deadline || '2026-09-30',
      createdAt: new Date().toISOString(),
    };

    store.challenges.unshift(newChallenge);
    return res.status(201).json(newChallenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    return res.status(500).json({ message: 'Failed to create challenge' });
  }
});

// PUT /api/challenges/:id (Admin)
router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  const challenge = store.challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const { title, description, image, pandalId, latitude, longitude, points, difficulty, deadline } = req.body;

  if (title) challenge.title = title;
  if (description) challenge.description = description;
  if (image) challenge.image = image;
  if (pandalId !== undefined) {
    challenge.pandalId = pandalId;
    const p = store.pandals.find((p) => p.id === pandalId);
    challenge.pandalName = p ? p.name : '';
  }
  if (latitude !== undefined) challenge.latitude = Number(latitude);
  if (longitude !== undefined) challenge.longitude = Number(longitude);
  if (points !== undefined) challenge.points = Number(points);
  if (difficulty) challenge.difficulty = difficulty;
  if (deadline) challenge.deadline = deadline;

  return res.json(challenge);
});

// DELETE /api/challenges/:id (Admin)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const index = store.challenges.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Challenge not found' });
  }
  const removed = store.challenges.splice(index, 1);
  return res.json({ message: 'Challenge deleted successfully', challenge: removed[0] });
});

export default router;
