import {supabase} from '../../../lib/supabase';

export const markWinner = async (nomineeId: number, categoryId: number) => {
    await supabase
        .from('nominees')
        .update({is_winner: false})
        .eq('category_id', categoryId);

    const {error} = await supabase
        .from('nominees')
        .update({is_winner: true})
        .eq('id', nomineeId);

    if (error) throw new Error(error.message);
};

export const addNomineeFromTMDB = async ({
                                             categoryId,
                                             movie,
                                         }: {
    categoryId: number;
    movie: { title: string; poster_path: string };
}) => {
    const {error} = await supabase
        .from('nominees')
        .insert({
            category_id: categoryId,
            name: movie.title,
            movie_title: movie.title,
            poster_path: movie.poster_path,
            is_winner: false
        });

    if (error) throw new Error(error.message);
};