import {type FC} from "react";
import {Col, Collapse, Row, Spin, Alert, List} from "antd";
import {CheckCircleFilled, LockOutlined} from "@ant-design/icons";
import {NomineeCard} from "./NomineeCard.tsx";
import {useCategories} from "../hooks/useCategories.ts";
import {useUserVotes} from "../hooks/useUserVotes.ts";
import {useVotingStatus} from "../hooks/useVotingStatus.ts";
import {useAuth} from "../../auth/context/AuthContext.tsx";

export const MovieCard: FC = () => {
    const {user} = useAuth();
    const {data: categories, isLoading: loadingCats} = useCategories();
    const {votes, castVote} = useUserVotes();
    const {data: votingClosed = false} = useVotingStatus();

    const isSelected = (categoryId: number, nomineeId: number) => {
        return votes?.some((v: any) => v.category_id === categoryId && v.nominee_id === nomineeId);
    };

    const hasVoted = (categoryId: number) => {
        return categories
            ?.find(cat => cat.id === categoryId)
            ?.nominees.some(nominee => isSelected(categoryId, nominee.id));
    };

    const handleVote = (categoryId: number, nomineeId: number) => {
        if (!user || votingClosed) return;
        castVote({userId: user.id, categoryId, nomineeId});
    };

    if (loadingCats) {
        return (
            <div style={{textAlign: 'center', marginTop: 50}}>
                <Spin size="large" tip="Cargando categorías..."/>
            </div>
        )
    }

    const categoriesLeft = categories
        ?.filter(category => category.nominees.every(nominee => !isSelected(category.id, nominee.id)))
        .map(category => category.name) ?? [];

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
            {categoriesLeft.length > 0 && (
                <Collapse items={[{
                    key: 1,
                    label: `Las siguientes categorías no tienen votación (${categoriesLeft.length})`,
                    styles: {
                        header: {
                            backgroundColor: '#1668dc',
                            color: '#fff',
                        },
                    },
                    children: (
                        <List
                            dataSource={categoriesLeft}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />
                    )
                }]}/>
            )}
            {votingClosed && (
                <Alert
                    icon={<LockOutlined/>}
                    title="La votación está cerrada"
                    description="Ya no es posible cambiar tus votos."
                    type="warning"
                    showIcon
                />
            )}
            {categories?.map((cat) => (
                <div key={cat.id}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        marginBottom: 16,
                        background: '#1a1a1a',
                        borderLeft: '4px solid #d4af37',
                        borderRadius: '0 4px 4px 0',
                    }}>
                        <span style={{color: '#fff', fontWeight: 600, fontSize: 16}}>
                            {cat.name}
                        </span>
                        {hasVoted(cat.id) && (
                            <CheckCircleFilled style={{color: '#52c41a', fontSize: 18}}/>
                        )}
                    </div>
                    <Row gutter={[24, 24]}>
                        {cat.nominees.map((nominee) => (
                            <Col key={nominee.id} xs={12} sm={8} md={6}>
                                <NomineeCard
                                    nominee={nominee}
                                    isSelected={isSelected(cat.id, nominee.id) || false}
                                    votingClosed={votingClosed}
                                    onVote={() => handleVote(cat.id, nominee.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    )
}
