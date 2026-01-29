import type {FC} from "react";
import {Col, Collapse, Row, Spin} from "antd";
import {NomineeCard} from "./NomineeCard.tsx";
import {useCategories} from "../hooks/useCategories.ts";
import {useUserVotes} from "../hooks/useUserVotes.ts";
import {useAuth} from "../../auth/context/AuthContext.tsx";

export const MovieCard: FC = () => {
    const {user} = useAuth();
    const {data: categories, isLoading: loadingCats} = useCategories();
    const {votes, castVote} = useUserVotes();

    const isSelected = (categoryId: number, nomineeId: number) => {
        return votes?.some((v: any) => v.category_id === categoryId && v.nominee_id === nomineeId);
    };

    const handleVote = (categoryId: number, nomineeId: number) => {
        if (!user) return;
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
            <Collapse items={categoriesItems}/>
        </div>
    )
}