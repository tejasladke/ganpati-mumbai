import { Router } from 'express';
import { Pandal } from '../../types.js';
import { adminOnly, authMiddleware } from '../auth.js';
import { store } from '../db.js';

const router = Router();

// GET /api/pandals
router.get('/', (req, res) => {
  let list = [...store.pandals];
  const { area, search, crowdLevel, sort } = req.query;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (area && typeof area === 'string' && area !== 'All') {
    list = list.filter((p) => p.area.toLowerCase() === area.toLowerCase());
  }

  if (crowdLevel && typeof crowdLevel === 'string' && crowdLevel !== 'All') {
    list = list.filter((p) => p.crowdLevel.toLowerCase() === crowdLevel.toLowerCase());
  }

  if (sort === 'popularity') {
    list.sort((a, b) => b.popularity - a.popularity);
  } else if (sort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return res.json(list);
});

// GET /api/pandals/:id
router.get('/:id', (req, res) => {
  const pandal = store.pandals.find((p) => p.id === req.params.id);
  if (!pandal) {
    return res.status(404).json({ message: 'Pandal not found' });
  }
  return res.json(pandal);
});

// POST /api/pandals (Admin)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const {
      name,
      description,
      history,
      images,
      address,
      area,
      latitude,
      longitude,
      darshanStart,
      darshanEnd,
      crowdLevel,
      facilities,
      popularity,
      famousFeatures,
    } = req.body;

    if (!name || !address || !area || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Name, address, area, latitude, and longitude are required' });
    }

    const newPandal: Pandal = {
      id: `pandal-${Date.now()}`,
      name,
      description: description || '',
      history: history || '',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'],
      address,
      area,
      latitude: Number(latitude),
      longitude: Number(longitude),
      darshanStart: darshanStart || '06:00 AM',
      darshanEnd: darshanEnd || '11:00 PM',
      crowdLevel: crowdLevel || 'Moderate',
      facilities: Array.isArray(facilities) ? facilities : ['Prasad Counter', 'First Aid'],
      popularity: Number(popularity) || 80,
      famousFeatures: Array.isArray(famousFeatures) ? famousFeatures : ['Grand Idol'],
      createdAt: new Date().toISOString(),
    };

    store.pandals.unshift(newPandal);
    return res.status(201).json(newPandal);
  } catch (error) {
    console.error('Create pandal error:', error);
    return res.status(500).json({ message: 'Failed to create pandal' });
  }
});

// PUT /api/pandals/:id (Admin)
router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  const pandal = store.pandals.find((p) => p.id === req.params.id);
  if (!pandal) {
    return res.status(404).json({ message: 'Pandal not found' });
  }

  const {
    name,
    description,
    history,
    images,
    address,
    area,
    latitude,
    longitude,
    darshanStart,
    darshanEnd,
    crowdLevel,
    facilities,
    popularity,
    famousFeatures,
  } = req.body;

  if (name) pandal.name = name;
  if (description !== undefined) pandal.description = description;
  if (history !== undefined) pandal.history = history;
  if (Array.isArray(images)) pandal.images = images;
  if (address) pandal.address = address;
  if (area) pandal.area = area;
  if (latitude !== undefined) pandal.latitude = Number(latitude);
  if (longitude !== undefined) pandal.longitude = Number(longitude);
  if (darshanStart) pandal.darshanStart = darshanStart;
  if (darshanEnd) pandal.darshanEnd = darshanEnd;
  if (crowdLevel) pandal.crowdLevel = crowdLevel;
  if (Array.isArray(facilities)) pandal.facilities = facilities;
  if (popularity !== undefined) pandal.popularity = Number(popularity);
  if (Array.isArray(famousFeatures)) pandal.famousFeatures = famousFeatures;

  return res.json(pandal);
});

// DELETE /api/pandals/:id (Admin)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const index = store.pandals.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pandal not found' });
  }
  const removed = store.pandals.splice(index, 1);
  return res.json({ message: 'Pandal deleted successfully', pandal: removed[0] });
});

export default router;
