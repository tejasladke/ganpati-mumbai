import { Router } from 'express';
import { PlannerItem } from '../../types.js';
import { AuthRequest, authMiddleware } from '../auth.js';
import { store } from '../db.js';

const router = Router();

// GET /api/planner
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const items = store.planner
    .filter((p) => p.userId === user.id)
    .map((item) => ({
      ...item,
      pandal: store.pandals.find((p) => p.id === item.pandalId),
    }))
    .sort((a, b) => a.order - b.order);

  return res.json(items);
});

// POST /api/planner
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const { pandalId, visitDate, visitTime } = req.body;

  if (!pandalId) {
    return res.status(400).json({ message: 'Pandal ID is required' });
  }

  const userItems = store.planner.filter((p) => p.userId === user.id);
  const nextOrder = userItems.length + 1;

  const newItem: PlannerItem = {
    id: `plan-${Date.now()}`,
    userId: user.id,
    pandalId,
    visitDate: visitDate || new Date().toISOString().split('T')[0],
    visitTime: visitTime || '09:00 AM',
    order: nextOrder,
    createdAt: new Date().toISOString(),
  };

  store.planner.push(newItem);

  const populated = {
    ...newItem,
    pandal: store.pandals.find((p) => p.id === pandalId),
  };

  return res.status(201).json(populated);
});

// PUT /api/planner/:id
router.put('/:id', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const item = store.planner.find((p) => p.id === req.params.id && p.userId === user.id);

  if (!item) {
    return res.status(404).json({ message: 'Planner item not found' });
  }

  const { visitDate, visitTime, order } = req.body;

  if (visitDate) item.visitDate = visitDate;
  if (visitTime) item.visitTime = visitTime;
  if (order !== undefined) item.order = Number(order);

  const populated = {
    ...item,
    pandal: store.pandals.find((p) => p.id === item.pandalId),
  };

  return res.json(populated);
});

// DELETE /api/planner/:id
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user!;
  const index = store.planner.findIndex((p) => p.id === req.params.id && p.userId === user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Planner item not found' });
  }

  const removed = store.planner.splice(index, 1);
  return res.json({ message: 'Removed from itinerary', item: removed[0] });
});

export default router;
