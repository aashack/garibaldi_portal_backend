import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthPayload {
  sub: string; // userId
  username: string;
  exp: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; username: string };
  }
}

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  // Do not throw at import time in case dotenv not loaded yet; validate per-request
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Allow CORS preflight to pass without auth
    if (req.method === 'OPTIONS') return next();

    const auth = req.header('authorization') || req.header('Authorization');
    if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = auth.slice(7).trim();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const payload = jwt.verify(token, secret) as AuthPayload;
    if (!payload?.sub) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Unauthorized', details: err?.message });
  }
}
