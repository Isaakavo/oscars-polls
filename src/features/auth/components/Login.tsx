import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        const { email, password, fullName } = values;

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) throw error;
                message.success('¡Registro exitoso! Ya puedes iniciar sesión.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                message.success('Bienvenido a la Quiniela');
                navigate('/');
            }
        } catch (error: any) {
            message.error(error.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#141414' }}>
            <Card style={{ width: '100%', maxWidth: 400, border: '1px solid #d4af37' }} variant={'borderless'}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#d4af37' }}>Oscars 2026</Title>
                    <Text type="secondary">Inicia sesión para votar</Text>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    {isSignUp && (
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nombre Completo" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Por favor ingresa tu correo' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Correo electrónico" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            {isSignUp ? 'Registrarse' : 'Entrar'}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Layout>
    );
};