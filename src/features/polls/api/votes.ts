import {supabase} from '../../../lib/supabase';

// Obtener los votos del usuario actual
export const getUserVotes = async (userId: string) => {
    const {data, error} = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
};

export const castVote = async ({
                                   userId,
                                   categoryId,
                                   nomineeId,
                               }: {
    userId: string;
    categoryId: number;
    nomineeId: number;
}) => {
    const {data, error} = await supabase
        .from('votes')
        .upsert(
            {user_id: userId, category_id: categoryId, nominee_id: nomineeId},
            {onConflict: 'user_id, category_id'} // La restricción única que creamos en SQL
        )
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};