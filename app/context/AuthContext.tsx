import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
export interface User {
    id: string;
    mobile: string;
    role: 'USER' | 'ADMIN' | 'SUPERADMIN';
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicUrl?: string;
    userUUID?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAuthData();
    }, []);

    const loadAuthData = async () => {
        try {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem('authToken'),
                AsyncStorage.getItem('userData'),
            ]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Auth load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (newToken: string, newUser: User) => {
        try {
            await Promise.all([
                AsyncStorage.setItem('authToken', newToken),
                AsyncStorage.setItem('userData', JSON.stringify(newUser)),
            ]);
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem('authToken'),
                AsyncStorage.removeItem('userData'),
            ]);
            setToken(null);
            setUser(null); // 👈 Ye turant _layout.tsx ko update karega
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};