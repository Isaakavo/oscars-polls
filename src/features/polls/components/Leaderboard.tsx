import { useState } from 'react';
import { List, Avatar, Typography, Select, Button, Modal, Input, message, Alert } from 'antd';
import {PlusOutlined, CopyOutlined, GlobalOutlined, TrophyFilled} from '@ant-design/icons';
import { useCategories } from '../hooks/useCategories';
import { useRealtimeVotes } from '../hooks/useRealTimeVotes';
import { calculateLeaderboard } from '../utils/scoreCalculator';
import { useAuth } from '../../auth/context/AuthContext';
import { useGroups, useGroupMembers } from '../hooks/useGroups'; // Tu nuevo hook

const { Text } = Typography;

export const Leaderboard = () => {
    const { user } = useAuth();
    const { data: categories } = useCategories();
    const { allVotes } = useRealtimeVotes();
    const { groups, createGroup } = useGroups();

    // Estado para el filtro: null = Global, string = Group ID
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    // Obtener miembros del grupo seleccionado (si hay uno)
    const { data: memberIds } = useGroupMembers(selectedGroupId);

    // Estados para Modal de Crear Grupo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    // Lógica de filtrado
    const filteredVotes = selectedGroupId
        ? allVotes?.filter((v: any) => memberIds?.includes(v.user_id)) // Filtrar solo miembros
        : allVotes; // Global

    const leaderboard = calculateLeaderboard(filteredVotes || [], categories || []);

    // Helpers para UI
    const handleCreateGroup = async () => {
        if(!newGroupName) return;
        await createGroup(newGroupName);
        setIsModalOpen(false);
        setNewGroupName('');
        message.success('Grupo creado');
    };

    const currentGroup = groups?.find(g => g.id === selectedGroupId);

    const copyInviteLink = () => {
        if(currentGroup) {
            const link = `${window.location.origin}/join/${currentGroup.invite_code}`;
            navigator.clipboard.writeText(link);
            message.success('Link copiado al portapapeles');
        }
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <TrophyFilled style={{ color: '#FFD700', fontSize: 24 }} />;
            case 1: return <TrophyFilled style={{ color: '#C0C0C0', fontSize: 20 }} />;
            case 2: return <TrophyFilled style={{ color: '#CD7F32', fontSize: 18 }} />;
            default: return <Text strong style={{ color: '#666', fontSize: 16 }}>#{index + 1}</Text>;
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', marginTop: 24 }}>
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Typography.Title level={2} style={{ color: '#d4af37', textAlign: 'center', margin: 0 }}>
                    Tabla de Posiciones
                </Typography.Title>

                <div style={{ display: 'flex', gap: 8 }}>
                    <Select
                        style={{ flex: 1 }}
                        placeholder="Selecciona una vista"
                        defaultValue={null}
                        onChange={setSelectedGroupId}
                        options={[
                            { value: null, label: <><GlobalOutlined /> Global</> },
                            ...(groups?.map(g => ({ value: g.id, label: `👥 ${g.name}` })) || [])
                        ]}
                    />
                    <Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} />
                </div>

                {selectedGroupId && currentGroup && (
                    <Alert
                        title={`Estás viendo: ${currentGroup.name}`}
                        description={
                            <Button type="link" size="small" icon={<CopyOutlined />} onClick={copyInviteLink} style={{ padding: 0 }}>
                                Copiar link de invitación para amigos
                            </Button>
                        }
                        type="info"
                        showIcon
                        style={{ background: '#1f1f1f', border: '1px solid #d4af37', color: 'white' }}
                    />
                )}
            </div>

            <List
                itemLayout="horizontal"
                dataSource={leaderboard}
                renderItem={(item, index) => {
                    const isMe = item.userId === user?.id;
                    return (
                        <List.Item
                            style={{
                                background: isMe ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
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

            <Modal
                title="Crear Nuevo Grupo"
                open={isModalOpen}
                onOk={handleCreateGroup}
                onCancel={() => setIsModalOpen(false)}
                okText="Crear"
            >
                <Input
                    placeholder="Nombre del grupo"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                />
            </Modal>
        </div>
    );
};