import { Layout, Typography, Card, Spin, Row, Col, Alert } from 'antd';
import { useCategories } from './features/polls/hooks/useCategories';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    const { data: categories, isLoading, isError, error } = useCategories();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    🏆 Oscars Quiniela
                </Title>
            </Header>

            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                        <Spin size="large" tip="Cargando nominados..." />
                    </div>
                )}

                {isError && (
                    <Alert
                        title="Error al cargar"
                        description={error instanceof Error ? error.message : 'Algo salió mal'}
                        type="error"
                        showIcon
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {categories?.map((category) => (
                        <div key={category.id}>
                            <Title level={4} style={{ borderLeft: '4px solid #d4af37', paddingLeft: 12 }}>
                                {category.name}
                            </Title>

                            <Row gutter={[16, 16]}>
                                {category.nominees.map((nominee) => (
                                    <Col key={nominee.id} xs={24} sm={12} md={8} lg={6}>
                                        <Card
                                            hoverable
                                            cover={
                                                <img
                                                    alt={nominee.name}
                                                    src={nominee.poster_path}
                                                    style={{ height: 300, objectFit: 'cover' }}
                                                />
                                            }
                                        >
                                            <Card.Meta
                                                title={nominee.name}
                                                description={nominee.movie_title !== nominee.name ? nominee.movie_title : 'Nominado'}
                                            />
                                        </Card>
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