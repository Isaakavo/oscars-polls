import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { joinGroupByCode } from '../api/groups';
import { message, Spin } from 'antd';

export const JoinGroupRoute = () => {
    const { inviteCode } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const attemptRef = useRef(false); // Evitar doble ejecución en React StrictMode

    useEffect(() => {
        if (!inviteCode || !user || attemptRef.current) {
            if (!user) {
                message.error('Necesitar iniciar sesion para unirte a un grupo')
                navigate({
                    pathname: '/login',
                    search: '?inviteCode=' + inviteCode,
                })
            }
            return;
        }

        const join = async () => {
            attemptRef.current = true;
            try {
                await joinGroupByCode(inviteCode, user.id);
                message.success('¡Te has unido al grupo con éxito!');
                navigate('/'); // Redirigir al dashboard
            } catch (error) {
                message.error('El código de invitación no es válido');
                navigate('/');
            }
        };

        join();
    }, [inviteCode, user, navigate]);

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black', color: 'white' }}>
            <Spin size="large" tip="Uniéndote al grupo..." />
        </div>
    );
};