"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("./lib/firebase-admin"));
const createDefaultAdmin = async () => {
    const email = 'admin@theproductivehouse.com';
    const password = 'admin123';
    const displayName = 'The Productive House Admin';
    try {
        let user;
        try {
            user = await firebase_admin_1.default.auth().getUserByEmail(email);
            console.log('✅ Admin user already exists:', user.uid);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('Creating new admin user...');
                user = await firebase_admin_1.default.auth().createUser({
                    email,
                    password,
                    displayName,
                    emailVerified: true
                });
                console.log('✅ Created admin user:', user.uid);
            }
            else {
                throw error;
            }
        }
        // Set admin claim
        await firebase_admin_1.default.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
        console.log('✅ Set admin custom claim for user');
    }
    catch (error) {
        console.error('❌ Error creating default admin:', error);
        process.exit(1);
    }
};
createDefaultAdmin().then(() => {
    console.log('Done.');
    process.exit(0);
});
