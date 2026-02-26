import type {FC} from "react";
import {Col, Collapse, Row, Spin, Alert} from "antd";
import {LockOutlined} from "@ant-design/icons";
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

    const categoriesItems = categories?.map((cat, index) => ({
        key: index,
        label: cat.name,
        children: (
            <>
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
            </>
        )
    }))

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
            {votingClosed && (
                <Alert
                    icon={<LockOutlined/>}
                    message="La votación está cerrada"
                    description="Ya no es posible cambiar tus votos."
                    type="warning"
                    showIcon
                />
            )}
            <Collapse items={categoriesItems}/>
        </div>
    )
}