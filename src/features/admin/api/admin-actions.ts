import { supabase } from '../../../lib/supabase';

export const markWinner = async (nomineeId: number, categoryId: number) => {
    await supabase
        .from('nominees')
        .update({ is_winner: false })
        .eq('category_id', categoryId);

    const { error } = await supabase
        .from('nominees')
        .update({ is_winner: true })
        .eq('id', nomineeId);

    if (error) throw new Error(error.message);
};