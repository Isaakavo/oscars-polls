import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from '../../features/auth/context/AuthContext';
import {LoginPage} from '../../features/auth/components/Login';
import App from '../../App';
import type {JSX} from "react";
import {AdminDashboard} from "../../features/admin/components/AdminDashboard.tsx";
import {JoinGroupRoute} from "../../features/polls/components/JoinGroupRoute.tsx";

const PrivateRoute = ({children}: { children: JSX.Element }) => {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

const AdminRoute = ({children}: { children: JSX.Element }) => {
    const {user} = useAuth();

    if (!user || !user.email || !user.isAdmin) {
        if(!user?.isAdmin) {
            return <Navigate to="/" replace/>;
        }
        return <Navigate to="/login" replace/>;
    }

    return children;
}

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <App/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard/>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/join/:inviteCode"
                    element={<JoinGroupRoute/>}
                />
            </Routes>
        </BrowserRouter>
    );
};