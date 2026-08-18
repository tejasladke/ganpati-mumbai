
import 'dotenv/config';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

import { initDb } from './src/server/db.js';
import adminRoutes from './src/server/routes/adminRoutes.js';
import aiRoutes from './src/server/routes/aiRoutes.js';
import authRoutes from './src/server/routes/authRoutes.js';
import challengeRoutes from './src/server/routes/challengeRoutes.js';
import favoriteRoutes from './src/server/routes/favoriteRoutes.js';
import leaderboardRoutes from './src/server/routes/leaderboardRoutes.js';
import pandalRoutes from './src/server/routes/pandalRoutes.js';
import plannerRoutes from './src/server/routes/plannerRoutes.js';
import submissionRoutes from './src/server/routes/submissionRoutes.js';
import uploadRoutes from './src/server/routes/uploadRoutes.js';
import communityRoutes from './src/server/routes/communityRoutes.js';
import { store } from './src/server/db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  await initDb();

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/pandals', pandalRoutes);
  app.use('/api/challenges', challengeRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/favorites', favoriteRoutes);
  app.use('/api/planner', plannerRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/community', communityRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Middleware in dev mode, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = createHttpServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: true, credentials: true },
  });

  const JWT_SECRET = process.env.JWT_SECRET || 'mumbai_ganpati_secret_jwt_key_2026';

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = store.users.find(u => u.id === decoded.id);
      if (!user) return next(new Error('User not found'));
      (socket as any).user = user;
      next();
    } catch {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    socket.join(`user:${user.id}`);

    socket.on('join_conversation', (conversationId: string) => {
      const conversation = store.conversations.find(c => c.id === conversationId);
      if (conversation?.participantIds.includes(user.id)) socket.join(`conversation:${conversationId}`);
    });

    socket.on('send_message', (payload: { conversationId: string; text: string }) => {
      const conversation = store.conversations.find(c => c.id === payload.conversationId);
      const text = String(payload.text || '').trim().slice(0, 2000);
      if (!conversation || !conversation.participantIds.includes(user.id) || !text) return;

      const connected = store.connections.some(c =>
        c.status === 'accepted' &&
        ((c.requesterId === user.id && c.recipientId === conversation.participantIds.find(id => id !== user.id)) ||
         (c.recipientId === user.id && c.requesterId === conversation.participantIds.find(id => id !== user.id)))
      );
      if (!connected) return;

      const message = {
        id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        conversationId: conversation.id,
        senderId: user.id,
        senderName: user.name,
        text,
        status: 'delivered',
        readBy: [user.id],
        createdAt: new Date().toISOString(),
      };
      store.messages.push(message as any);
      conversation.updatedAt = message.createdAt;
      const recipientId = conversation.participantIds.find(id => id !== user.id);
      if (recipientId) {
        store.notifications.unshift({
          id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          userId: recipientId,
          type: 'message',
          title: `New message from ${user.name}`,
          message: text.slice(0, 100),
          relatedId: conversation.id,
          read: false,
          createdAt: message.createdAt,
        });
        io.to(`user:${recipientId}`).emit('message_notification', { conversationId: conversation.id });
      }
      io.to(`conversation:${conversation.id}`).emit('new_message', message);
    });

    socket.on('typing', (payload: { conversationId: string; isTyping: boolean }) => {
      const conversation = store.conversations.find(c => c.id === payload.conversationId);
      if (conversation?.participantIds.includes(user.id)) {
        socket.to(`conversation:${payload.conversationId}`).emit('typing', { userId: user.id, isTyping: !!payload.isTyping });
      }
    });

    socket.on('mark_read', (conversationId: string) => {
      const conversation = store.conversations.find(c => c.id === conversationId);
      if (!conversation?.participantIds.includes(user.id)) return;
      store.messages.filter(m => m.conversationId === conversationId && m.senderId !== user.id).forEach(m => {
        if (!m.readBy.includes(user.id)) m.readBy.push(user.id);
        m.status = 'read';
      });
      io.to(`conversation:${conversationId}`).emit('messages_read', { userId: user.id, conversationId });
    });
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Ganpati Mumbai Explorer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
