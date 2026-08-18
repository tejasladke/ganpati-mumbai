import { Router } from 'express';
import { Submission } from '../../types.js';
import { AuthRequest, adminOnly, authMiddleware } from '../auth.js';
import { checkUserBadges, store } from '../db.js';

const router = Router();

// POST /api/submissions (User)
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const { challengeId, image, latitude, longitude, notes } = req.body;

    if (!challengeId || !image) {
      return res.status(400).json({ message: 'Challenge ID and proof image are required' });
    }

    const challenge = store.challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      image,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      notes: notes || '',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    store.submissions.unshift(newSub);
    return res.status(201).json(newSub);
  } catch (error) {
    console.error('Submit challenge error:', error);
    return res.status(500).json({ message: 'Failed to submit challenge proof' });
  }
});

// GET /api/submissions/my (User)
router.get('/my', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const userSubs = store.submissions.filter((s) => s.userId === user.id);
  return res.json(userSubs);
});

// GET /api/submissions (Admin)
router.get('/', authMiddleware, adminOnly, (req, res) => {
  return res.json(store.submissions);
});

// PUT /api/submissions/:id/approve (Admin)
router.put('/:id/approve', authMiddleware, adminOnly, (req, res) => {
  const sub = store.submissions.find((s) => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  if (sub.status === 'Approved') {
    return res.status(400).json({ message: 'Submission has already been approved' });
  }

  const challenge = store.challenges.find((c) => c.id === sub.challengeId);
  const awardPoints = challenge ? challenge.points : 100;

  sub.status = 'Approved';
  sub.reviewedAt = new Date().toISOString();
  sub.rejectionReason = undefined;

  // Award points & update user
  const user = store.users.find((u) => u.id === sub.userId);
  if (user) {
    user.points += awardPoints;
    user.completedChallenges += 1;
    user.badges = checkUserBadges(user);
  }

  return res.json({ message: 'Submission approved successfully!', submission: sub, awardedPoints: awardPoints });
});

// PUT /api/submissions/:id/reject (Admin)
router.put('/:id/reject', authMiddleware, adminOnly, (req, res) => {
  const sub = store.submissions.find((s) => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  const { rejectionReason } = req.body;

  sub.status = 'Rejected';
  sub.rejectionReason = rejectionReason || 'Location or photo proof could not be verified.';
  sub.reviewedAt = new Date().toISOString();

  return res.json({ message: 'Submission rejected', submission: sub });
});

export default router;
