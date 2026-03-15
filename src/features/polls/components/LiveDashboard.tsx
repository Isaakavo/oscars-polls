import {Avatar, Tooltip, Typography, Divider} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useRealtimeVotes} from '../hooks/useRealTimeVotes';
import {useCategories} from '../hooks/useCategories';
import {useAuth} from '../../auth/context/AuthContext';
import {calculateLeaderboard} from '../utils/scoreCalculator';
import {NomineeCard} from "./NomineeCard.tsx";

const {Title, Text} = Typography;

export const LiveDashboard = () => {
    const {user} = useAuth();
    const {data: categories} = useCategories();
    const {allVotes} = useRealtimeVotes();

    const leaderboard = calculateLeaderboard(allVotes || [], categories || []);

    const getVotersForNominee = (nomineeId: number) => {
        if (!allVotes) return [];
        return allVotes.filter((v: any) => v.nominee_id === nomineeId);
    };

    return (
        <div>
            <Divider orientation={'horizontal'} style={{borderColor: '#d4af37'}}>
                <span style={{fontSize: 24, color: '#d4af37'}}>🏆 Puntajes Globales</span>
            </Divider>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 24,
            }}>
                {leaderboard.map((item) => {
                    const isMe = item.userId === user?.id;
                    return (
                        <Tooltip key={item.userId} title={item.fullName}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: isMe ? '1px solid #d4af37' : '1px solid #303030',
                                background: isMe ? 'rgba(212, 175, 55, 0.1)' : '#1a1a1a',
                            }}>
                                <Avatar
                                    src={item.avatarUrl}
                                    icon={<UserOutlined/>}
                                    size={40}
                                    style={{backgroundColor: '#d4af37'}}
                                />
                                <Text style={{color: '#d4af37', fontSize: 18, fontWeight: 'bold', lineHeight: 1}}>
                                    {item.score}
                                </Text>
                                <Text style={{fontSize: 10, color: '#666', lineHeight: 1}}>PTS</Text>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            <Divider orientation={'horizontal'} style={{borderColor: '#d4af37'}}>
                <span style={{fontSize: 24, color: '#d4af37'}}>📊 Tendencias en Vivo</span>
            </Divider>

            <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
                {categories?.map((category) => (
                    <div key={category.id}>
                        <Title level={4} style={{color: 'white'}}>
                            {category.name}
                        </Title>

                        <div style={{
                            display: 'flex',
                            gap: 16,
                            overflowX: 'auto',
                            paddingBottom: 16,
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#333 transparent'
                        }}>
                            {[...category.nominees].sort((a, b) => Number(b.is_winner) - Number(a.is_winner)).map((nominee) => (
                                <div key={nominee.id} style={{minWidth: 200, maxWidth: 200}}>
                                    <NomineeCard
                                        nominee={nominee}
                                        isSelected={false}
                                        votingClosed={true}
                                        onVote={() => {}}
                                        voters={getVotersForNominee(nominee.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
