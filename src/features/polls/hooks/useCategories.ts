import { useQuery } from '@tanstack/react-query';
import { getCategoriesWithNominees } from '../api/get-categories';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'], // Clave única para el caché
        queryFn: getCategoriesWithNominees,
    });
};