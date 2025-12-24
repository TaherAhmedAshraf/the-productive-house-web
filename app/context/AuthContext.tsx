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
import { auth } from '../lib/firebase';
import { getMe, updateUserProfile as updateProfileApi } from '../lib/api';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'user' | 'admin';
    createdAt?: string;
    wishlist?: any[];
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchUserProfile = async (firebaseUser: User) => {
        try {
            const profile = await getMe();
            setUserProfile(profile);
            // The actual isAdmin state is managed by the token claim in useEffect
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchUserProfile(user);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Check if user is admin from token result as the absolute source of truth
                const tokenResult = await user.getIdTokenResult();
                setIsAdmin(!!tokenResult.claims.admin);

                // Fetch/Sync user profile from Backend
                await fetchUserProfile(user);
            } else {
                setUserProfile(null);
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });

        // Profile will be created by backend on first /me call
        await fetchUserProfile(userCredential.user);
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        await fetchUserProfile(userCredential.user);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        await updateProfileApi(data);
        await refreshProfile();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                isAdmin,
                signUp,
                signIn,
                signInWithGoogle,
                logout,
                updateUserProfile,
                refreshProfile,
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
