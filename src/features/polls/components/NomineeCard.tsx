import {Card} from 'antd';
import {CheckCircleFilled} from '@ant-design/icons';
import {motion} from 'framer-motion'; // Para una animación suave al seleccionar

interface NomineeCardProps {
    nominee: {
        id: number;
        name: string;
        movie_title: string;
        poster_path: string;
    };
    isSelected: boolean;
    onVote: () => void;
}

export const NomineeCard = ({nominee, isSelected, onVote}: NomineeCardProps) => {
    return (
        <motion.div
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
        >
            <Card
                hoverable
                onClick={onVote}
                style={{
                    border: isSelected ? '2px solid #d4af37' : '1px solid #303030',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isSelected ? '#1f1f1f' : '#141414',
                }}
                cover={
                    <div style={{position: 'relative'}}>
                        <img
                            alt={nominee.name}
                            src={nominee.poster_path}
                            style={{
                                height: 320,
                                width: '100%',
                                objectFit: 'cover',
                                opacity: isSelected ? 1 : 0.8 // Un poco opaco si no está seleccionado
                            }}
                        />
                        {isSelected && (
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: '#d4af37',
                                borderRadius: '50%',
                                padding: 4,
                                display: 'flex'
                            }}>
                                <CheckCircleFilled style={{color: 'black', fontSize: 24}}/>
                            </div>
                        )}
                    </div>
                }
            >
                <Card.Meta
                    title={<span style={{color: isSelected ? '#d4af37' : 'white'}}>{nominee.name}</span>}
                    description={
                        <span style={{color: 'gray'}}>
              {nominee.movie_title !== nominee.name ? nominee.movie_title : 'Nominado'}
            </span>
                    }
                />
            </Card>
        </motion.div>
    );
};