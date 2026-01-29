import {Card} from 'antd';
import {CheckCircleFilled, CrownFilled} from '@ant-design/icons';
import {motion} from 'framer-motion'; // Para una animación suave al seleccionar

interface NomineeCardProps {
    nominee: {
        id: number;
        name: string;
        movie_title: string;
        poster_path: string;
        is_winner: boolean;
    };
    isSelected: boolean;
    onVote: () => void;
}

export const NomineeCard = ({nominee, isSelected, onVote}: NomineeCardProps) => {
    const isCorrectGuess = isSelected && nominee.is_winner;

    return (
        <motion.div
            whileHover={{scale: 1.02}}
            animate={nominee.is_winner ? {scale: [1, 1.05, 1]} : {}}
            transition={{duration: 0.5}}
        >
            <Card
                hoverable
                onClick={nominee.is_winner ? undefined : onVote}
                style={{
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
                        <img
                            alt={nominee.name}
                            src={nominee.poster_path}
                            style={{
                                height: 'auto', width: '100%', aspectRatio: '2/3',
                                opacity: isSelected || nominee.is_winner ? 1 : 0.6,
                                filter: nominee.is_winner ? 'none' : 'grayscale(20%)' // Resaltar ganador a color
                            }}
                        />

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
                    description={''}
                />
            </Card>
        </motion.div>
    );
};