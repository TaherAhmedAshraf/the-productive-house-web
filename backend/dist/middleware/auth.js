"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.optionalAuth = exports.verifyToken = void 0;
const firebase_admin_1 = require("../lib/firebase-admin");
/**
 * Middleware to verify Firebase ID token
 * Expects Authorization header: Bearer <token>
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized - No token provided' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        // Verify the token with Firebase Admin
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
        // Attach user info and custom claims to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name,
            admin: !!decodedToken.admin
        };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};
exports.verifyToken = verifyToken;
/**
 * Optional middleware - doesn't fail if no token
 * Useful for routes that work for both authenticated and non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                admin: !!decodedToken.admin
            };
        }
        next();
    }
    catch (error) {
        // Don't fail, just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Middleware to check if user is admin
 * Must be used after verifyToken
 */
const requireAdmin = async (req, res, next) => {
    if (!req.user || !req.user.admin) {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
