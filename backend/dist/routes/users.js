"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// PATCH /users/me - Update own profile
router.patch('/me', auth_1.verifyToken, async (req, res) => {
    try {
        const { displayName, photoURL } = req.body;
        const user = await User_1.default.findOneAndUpdate({ uid: req.user.uid }, { displayName, photoURL }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// GET /users/wishlist
router.get('/wishlist', auth_1.verifyToken, async (req, res) => {
    try {
        const user = await User_1.default.findOne({ uid: req.user.uid }).populate('wishlist');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ data: user.wishlist || [] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});
// POST /users/wishlist/toggle
router.post('/wishlist/toggle', auth_1.verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User_1.default.findOne({ uid: req.user.uid });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        if (!user.wishlist) {
            user.wishlist = [];
        }
        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
        }
        else {
            user.wishlist.splice(index, 1);
        }
        await user.save();
        res.json({ message: 'Wishlist updated', wishlist: user.wishlist });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to toggle wishlist' });
    }
});
// GET /users/me
router.get('/me', auth_1.verifyToken, async (req, res) => {
    try {
        const adminClaim = !!req.user.admin;
        const targetRole = adminClaim ? 'admin' : 'user';
        let user = await User_1.default.findOne({ uid: req.user.uid }).populate('wishlist');
        if (!user) {
            // Create user if they don't exist in MongoDB yet but are authenticated in Firebase
            user = await User_1.default.create({
                uid: req.user.uid,
                email: req.user.email,
                displayName: req.user.displayName,
                role: targetRole,
                wishlist: []
            });
        }
        else if (user.role !== targetRole) {
            // Sync role if it changed (e.g. user was promoted to admin in Firebase)
            user.role = targetRole;
            await user.save();
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
exports.default = router;
