"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// POST /users/profile
router.post('/profile', async (req, res) => {
    try {
        const { email, name, phone, uid, photoURL } = req.body; // Added uid as it's key in our model
        let updateData = { email, displayName: name, photoURL };
        // If phone is needed add to model, currently not in my User definition but allowed if strict=false or update model. 
        // For strict adherence to previous code, let's assume 'name' maps to 'displayName'.
        // Find by email or uid? Previous code used email.
        const user = await User_1.default.findOneAndUpdate({ email }, updateData, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.default = router;
