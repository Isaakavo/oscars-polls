import React, {createContext, useContext, useEffect, useState} from 'react';
import type {User, Session} from '@supabase/supabase-js';
import {supabase} from '../../../lib/supabase';
import {Spin} from 'antd';

export interface AppUser extends User {
    isAdmin?: boolean;
}

interface AuthContextType {
    user: AppUser | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const refreshSession = async (currentSession: Session | null) => {
            try {
                if (!currentSession?.user) {
                    setUser(null);
                    setSession(null);
                    setIsLoading(false);
                    return;
                }

                const { data } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', currentSession.user.id)
                    .single();


                const appUser: AppUser = {
                    ...currentSession.user,
                    isAdmin: data?.is_admin || false,
                };

                setUser(appUser);
                setSession(currentSession);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUser(currentSession?.user ?? null);
                setSession(currentSession);
            } finally {
                setIsLoading(false);
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            refreshSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            refreshSession(newSession);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#000'
            }}>
                <Spin size="large" tip="Verificando credenciales..."/>
            </div>
        );
    }

    console.log({user})

    return (
        <AuthContext.Provider value={{user, session, isLoading, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};