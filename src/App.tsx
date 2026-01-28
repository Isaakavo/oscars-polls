import { Layout, Typography, Spin, Row, Col, Button } from 'antd';
import { useCategories } from './features/polls/hooks/useCategories';
import { useUserVotes } from './features/polls/hooks/useUserVotes';
import { useAuth } from './features/auth/context/AuthContext';
import { NomineeCard } from './features/polls/components/NomineeCard';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
    const { user, signOut } = useAuth();
    const { data: categories, isLoading: loadingCats } = useCategories();
    const { votes, castVote } = useUserVotes();

    const handleVote = (categoryId: number, nomineeId: number) => {
        if (!user) return;
        castVote({ userId: user.id, categoryId, nomineeId });
    };

    // Helper para saber si un nominado está seleccionado
    const isSelected = (categoryId: number, nomineeId: number) => {
        return votes?.some((v: any) => v.category_id === categoryId && v.nominee_id === nomineeId);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#000' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Title level={3} style={{ color: '#d4af37', margin: 0 }}>🏆 Oscars</Title>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text style={{ color: 'white' }}>Hola, {user?.user_metadata.full_name}</Text>
                    <Button type="text" icon={<LogoutOutlined />} onClick={signOut} style={{ color: 'white' }} />
                </div>
            </Header>

            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                {loadingCats && (
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Spin size="large" tip="Cargando categorías..." />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {categories?.map((category) => (
                        <div key={category.id}>
                            <Title level={3} style={{ color: 'white', borderLeft: '4px solid #d4af37', paddingLeft: 12, marginBottom: 24 }}>
                                {category.name}
                            </Title>

                            <Row gutter={[24, 24]}>
                                {category.nominees.map((nominee) => (
                                    <Col key={nominee.id} xs={12} sm={8} md={6}>
                                        <NomineeCard
                                            nominee={nominee}
                                            isSelected={isSelected(category.id, nominee.id) || false}
                                            onVote={() => handleVote(category.id, nominee.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </div>
            </Content>
        </Layout>
    );
}

export default App;