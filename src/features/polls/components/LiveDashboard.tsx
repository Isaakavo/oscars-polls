import {Avatar, Tooltip, Card, Typography, Divider} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useRealtimeVotes} from '../hooks/useRealTimeVotes';
import {useCategories} from '../hooks/useCategories';
import {motion, AnimatePresence} from 'framer-motion';
import {NomineeImage} from "./NomineeImage.tsx";

const {Title} = Typography;

export const LiveDashboard = () => {
    const {data: categories} = useCategories();
    const {allVotes} = useRealtimeVotes();

    const getVotersForNominee = (nomineeId: number) => {
        if (!allVotes) return [];
        return allVotes.filter((v: any) => v.nominee_id === nomineeId);
    };

    return (
        <div>
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
                            {category.nominees.map((nominee) => {
                                const voters = getVotersForNominee(nominee.id);
                                const isPopular = voters.length > 2; // Ejemplo de lógica visual

                                return (
                                    <Card
                                        key={nominee.id}
                                        style={{
                                            minWidth: 200,
                                            maxWidth: 200,
                                            background: '#1f1f1f',
                                            borderColor: isPopular ? '#d4af37' : '#303030',
                                            borderWidth: isPopular ? 2 : 1,
                                        }}
                                        bodyStyle={{padding: 12}}
                                        cover={
                                            <NomineeImage nominee={nominee} isSelected={false} onVote={() => {}} />
                                        }
                                    >
                                        <div style={{marginBottom: 12, textAlign: 'center'}}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {nominee.name}
                                            </div>
                                            <div style={{fontSize: 12, color: 'gray'}}>
                                                {voters.length} votos
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 4,
                                            justifyContent: 'center',
                                            minHeight: 50
                                        }}>
                                            <AnimatePresence>
                                                {voters.map((vote: any) => (
                                                    <motion.div
                                                        key={vote.user_id}
                                                        initial={{scale: 0}}
                                                        animate={{scale: 1}}
                                                        exit={{scale: 0}}
                                                        layoutId={`avatar-${vote.user_id}-${category.id}`}
                                                    >
                                                        <Tooltip title={vote.profiles?.full_name || 'Usuario'}>
                                                            <Avatar
                                                                src={vote.profiles?.avatar_url}
                                                                icon={<UserOutlined/>}
                                                                style={{
                                                                    backgroundColor: '#d4af37',
                                                                    cursor: 'pointer',
                                                                    border: '1px solid black'
                                                                }}
                                                                size="small"
                                                            />
                                                        </Tooltip>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};