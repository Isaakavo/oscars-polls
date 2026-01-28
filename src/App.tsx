import {Layout, Typography} from 'antd';
import {Tabs} from 'antd'; // Importar Tabs
import {LiveDashboard} from './features/polls/components/LiveDashboard';
import {CountdownTimer} from './components/ui/CountdownTimer';
import {MovieCard} from "./features/polls/components/MovieCard.tsx";
import {Leaderboard} from "./features/polls/components/Leaderboard.tsx";

const {Header, Content} = Layout;
const {Title} = Typography;

function App() {

    return (
        <Layout style={{minHeight: '100vh', background: '#000'}}>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                height: 'auto',
                minHeight: 64,
                flexWrap: 'wrap'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <Title level={3} style={{color: '#d4af37', margin: 0}}>🏆 Oscars 2026</Title>
                </div>

                <div style={{margin: '0 20px'}}>
                    <CountdownTimer/>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    {/* ... User info ... */}
                </div>
            </Header>

            <Content style={{padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%'}}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: 'Mi Quiniela',
                            children: <MovieCard/>,
                        },
                        {
                            key: '2',
                            label: 'Tablero Global',
                            children: <LiveDashboard/>,
                        },
                        {
                            key: '3',
                            label: '🏆 Posiciones', // Nueva pestaña
                            children: <Leaderboard />,
                        }
                    ]}
                />
            </Content>
        </Layout>
    );
}

export default App;