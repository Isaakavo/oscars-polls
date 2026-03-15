import {Typography, Divider} from 'antd';
import {useRealtimeVotes} from '../hooks/useRealTimeVotes';
import {useCategories} from '../hooks/useCategories';
import {NomineeCard} from "./NomineeCard.tsx";

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
