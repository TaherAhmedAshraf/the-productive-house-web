"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /users/profile
router.post('/profile', (req, res) => {
    res.json({ message: 'Update profile' });
});
exports.default = router;
