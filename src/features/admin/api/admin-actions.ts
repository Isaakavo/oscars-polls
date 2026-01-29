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
                                             id,
                                             categoryId,
                                             movie,
                                         }: {
    id: number | undefined;
    categoryId: number;
    movie: { title: string; poster_path: string };
}) => {
    console.log('addNomineeFromTMDB', id);
    const {error} = await supabase
        .from('nominees')
        .upsert({
                id: id,
                category_id: categoryId,
                name: movie.title,
                movie_title: movie.title,
                poster_path: movie.poster_path,
                is_winner: false
            },
            {onConflict: 'id'});

    if (error) throw new Error(error.message);
};