import admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
}

export const auth = admin.auth();
export default admin;
