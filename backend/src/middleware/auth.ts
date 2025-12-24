import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/firebase-admin';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
                displayName?: string;
                admin?: boolean;
            };
        }
    }
}

/**
 * Middleware to verify Firebase ID token
 * Expects Authorization header: Bearer <token>
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized - No token provided' });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify the token with Firebase Admin
        const decodedToken = await auth.verifyIdToken(token);

        // Attach user info and custom claims to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name,
            admin: !!decodedToken.admin
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

/**
 * Optional middleware - doesn't fail if no token
 * Useful for routes that work for both authenticated and non-authenticated users
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await auth.verifyIdToken(token);

            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                admin: !!decodedToken.admin
            };
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};

/**
 * Middleware to check if user is admin
 * Must be used after verifyToken
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.admin) {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
        return;
    }
    next();
};
