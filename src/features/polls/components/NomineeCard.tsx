import {Avatar, Card, Tooltip} from 'antd';
import {CheckCircleFilled, CrownFilled, UserOutlined} from '@ant-design/icons';
import {motion, AnimatePresence} from 'framer-motion';
import {NomineeImage} from "./NomineeImage.tsx";

export interface Voter {
    user_id: string;
    profiles?: {
        full_name?: string;
        avatar_url?: string;
    };
}

export interface NomineeCardProps {
    nominee: {
        id: number;
        name: string;
        movie_title: string;
        poster_path: string;
        is_winner: boolean;
    };
    isSelected: boolean;
    votingClosed: boolean;
    onVote: () => void;
    voters?: Voter[];
}

export const NomineeCard = ({nominee, isSelected, votingClosed, onVote, voters}: NomineeCardProps) => {
    const isCorrectGuess = isSelected && nominee.is_winner;
    const isDisabled = votingClosed || nominee.is_winner;

    return (
        <motion.div
            whileHover={isDisabled ? {} : {scale: 1.02}}
            animate={nominee.is_winner ? {scale: [1, 1.05, 1]} : {}}
            transition={{duration: 0.5}}
        >
            <Card
                hoverable={!isDisabled}
                onClick={isDisabled ? undefined : onVote}
                style={{
                    cursor: isDisabled && !nominee.is_winner ? 'not-allowed' : undefined,
                    border: nominee.is_winner
                        ? '4px solid #FFD700'
                        : isSelected ? '2px solid #d4af37' : '1px solid #303030',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isSelected ? '#1f1f1f' : '#141414',
                    boxShadow: nominee.is_winner ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none'
                }}
                cover={
                    <div style={{position: 'relative'}}>
                        <NomineeImage nominee={nominee} isSelected={isSelected} votingClosed={votingClosed}
                                      onVote={() => {}} />

                        {/* Badge de Ganador Oficial */}
                        {nominee.is_winner && (
                            <div style={{
                                position: 'absolute', top: 10, left: 10,
                                background: '#FFD700', color: 'black',
                                padding: '4px 12px', borderRadius: 4, fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                display: 'flex', alignItems: 'center', gap: 5,
                                zIndex: 10
                            }}>
                                <CrownFilled/> GANADOR
                            </div>
                        )}

                        {/* Check de tu voto */}
                        {isSelected && (
                            // ... (mismo código del check de antes)
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: isCorrectGuess ? '#52c41a' : '#d4af37',
                                borderRadius: '50%',
                                padding: 4,
                                display: 'flex'
                            }}>
                                <CheckCircleFilled style={{color: 'white', fontSize: 24}}/>
                            </div>
                        )}
                    </div>
                }
            >
                <Card.Meta
                    title={
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{color: nominee.is_winner ? '#FFD700' : 'white'}}>{nominee.name}</span>
                        </div>
                    }
                    description={nominee.movie_title}
                />

                {voters !== undefined && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center',
                        minHeight: 50,
                        marginTop: 8,
                    }}>
                        <div style={{width: '100%', textAlign: 'center', fontSize: 12, color: 'gray', marginBottom: 4}}>
                            {voters.length} votos
                        </div>
                        <AnimatePresence>
                            {voters.map((vote) => (
                                <motion.div
                                    key={vote.user_id}
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    exit={{scale: 0}}
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
                )}
            </Card>
        </motion.div>
    );
};