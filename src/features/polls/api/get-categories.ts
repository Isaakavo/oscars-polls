import { supabase } from '../../../lib/supabase';

export interface Nominee {
    id: number;
    name: string;
    movie_title: string;
    poster_path: string;
    category_id: number;
    is_winner: boolean;
}

export interface Category {
    id: number;
    name: string;
    nominees: Nominee[]; // Supabase anidará esto automáticamente
}

export const getCategoriesWithNominees = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*, nominees(*)')
        .order('display_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data as Category[];
};