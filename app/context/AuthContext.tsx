'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt?: string;
    orders?: string[];
    wishlist?: string[];
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data() as UserProfile);
                } else {
                    // Create initial profile
                    const profile: UserProfile = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: new Date().toISOString(),
                        orders: [],
                        wishlist: [],
                    };
                    await setDoc(doc(db, 'users', user.uid), profile);
                    setUserProfile(profile);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name
        await updateProfile(userCredential.user, { displayName });

        // Create user profile in Firestore
        const profile: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName,
            photoURL: null,
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: [],
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), profile);
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);

        // Check if user profile exists, if not create one
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
            const profile: UserProfile = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
                createdAt: new Date().toISOString(),
                orders: [],
                wishlist: [],
            };
            await setDoc(doc(db, 'users', userCredential.user.uid), profile);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;

        const updatedProfile = { ...userProfile, ...data };
        await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
        setUserProfile(updatedProfile as UserProfile);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                signUp,
                signIn,
                signInWithGoogle,
                logout,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
