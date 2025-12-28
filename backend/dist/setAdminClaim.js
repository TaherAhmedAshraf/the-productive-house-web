"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("./lib/firebase-admin"));
/**
 * Script to set admin custom claims for a user
 * Usage: ts-node src/setAdminClaim.ts <user-email>
 */
const setAdminClaim = async (email) => {
    try {
        // Get user by email
        const user = await firebase_admin_1.default.auth().getUserByEmail(email);
        // Set custom claim
        await firebase_admin_1.default.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
        console.log(`✅ Successfully set admin claim for user: ${email}`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   User will need to sign out and sign in again for changes to take effect.`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error setting admin claim:', error);
        process.exit(1);
    }
};
// Get email from command line arguments
const email = process.argv[2];
if (!email) {
    console.error('❌ Please provide a user email');
    console.log('Usage: ts-node src/setAdminClaim.ts <user-email>');
    process.exit(1);
}
setAdminClaim(email);
