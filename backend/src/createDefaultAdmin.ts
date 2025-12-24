import admin from './lib/firebase-admin';

const createDefaultAdmin = async () => {
    const email = 'admin@theproductivehouse.com';
    const password = 'admin123';
    const displayName = 'The Productive House Admin';

    try {
        let user;
        try {
            user = await admin.auth().getUserByEmail(email);
            console.log('✅ Admin user already exists:', user.uid);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                console.log('Creating new admin user...');
                user = await admin.auth().createUser({
                    email,
                    password,
                    displayName,
                    emailVerified: true
                });
                console.log('✅ Created admin user:', user.uid);
            } else {
                throw error;
            }
        }

        // Set admin claim
        await admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
        console.log('✅ Set admin custom claim for user');

    } catch (error) {
        console.error('❌ Error creating default admin:', error);
        process.exit(1);
    }
};

createDefaultAdmin().then(() => {
    console.log('Done.');
    process.exit(0);
});
