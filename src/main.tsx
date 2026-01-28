import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppProviders} from "./app/providers/AppProviders.tsx";
import {AppRoutes} from "./app/routes/AppRoutes.tsx";
import {AuthProvider} from "./features/auth/context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppProviders>
            <AuthProvider>
                <AppRoutes/>
            </AuthProvider>
        </AppProviders>
    </React.StrictMode>,
)