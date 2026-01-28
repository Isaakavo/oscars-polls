import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from '../../features/auth/context/AuthContext';
import {LoginPage} from '../../features/auth/components/Login';
import App from '../../App';
import type {JSX} from "react";

const PrivateRoute = ({children}: { children: JSX.Element }) => {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

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
            </Routes>
        </BrowserRouter>
    );
};