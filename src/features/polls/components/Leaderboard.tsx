import { List, Avatar, Typography } from 'antd';
import { TrophyFilled } from '@ant-design/icons';
import { useCategories } from '../hooks/useCategories';
import { useRealtimeVotes } from '../hooks/useRealTimeVotes';
import { calculateLeaderboard } from '../utils/scoreCalculator';
import { useAuth } from '../../auth/context/AuthContext';

const { Text } = Typography;

export const Leaderboard = () => {
    const { user } = useAuth();
    const { data: categories } = useCategories();
    const { allVotes } = useRealtimeVotes();

    const leaderboard = calculateLeaderboard(allVotes || [], categories || []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <TrophyFilled style={{ color: '#FFD700', fontSize: 24 }} />; // Oro
            case 1: return <TrophyFilled style={{ color: '#C0C0C0', fontSize: 20 }} />; // Plata
            case 2: return <TrophyFilled style={{ color: '#CD7F32', fontSize: 18 }} />; // Bronce
            default: return <Text strong style={{ color: '#666', fontSize: 16 }}>#{index + 1}</Text>;
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', marginTop: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <Typography.Title level={2} style={{ color: '#d4af37' }}>
                    Tabla de Posiciones
                </Typography.Title>
                <Text type="secondary">¿Quién es el experto en cine?</Text>
            </div>

            <List
                itemLayout="horizontal"
                dataSource={leaderboard}
                renderItem={(item, index) => {
                    const isMe = item.userId === user?.id;
                    return (
                        <List.Item
                            style={{
                                background: isMe ? 'rgba(212, 175, 55, 0.1)' : 'transparent', // Resaltar mi fila
                                borderRadius: 8,
                                padding: '12px 16px',
                                marginBottom: 8,
                                border: isMe ? '1px solid #d4af37' : '1px solid #303030'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', width: 40, justifyContent: 'center', marginRight: 16 }}>
                                {getRankIcon(index)}
                            </div>

                            <List.Item.Meta
                                avatar={<Avatar src={item.avatarUrl} size="large" />}
                                title={
                                    <Text style={{ color: 'white', fontSize: 16 }}>
                                        {item.fullName} {isMe && '(Tú)'}
                                    </Text>
                                }
                                description={<Text type="secondary">{item.totalVotes} predicciones realizadas</Text>}
                            />

                            <div style={{ textAlign: 'right' }}>
                                <Text style={{ color: '#d4af37', fontSize: 24, fontWeight: 'bold' }}>
                                    {item.score}
                                </Text>
                                <div style={{ fontSize: 10, color: '#666' }}>PUNTOS</div>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};