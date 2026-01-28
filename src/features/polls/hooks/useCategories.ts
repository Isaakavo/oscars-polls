import { useEffect } from 'react'; // <--- Agregar useEffect
import { useQuery, useQueryClient } from '@tanstack/react-query'; // <--- Agregar useQueryClient
import { supabase } from '../../../lib/supabase'; // <--- Importar supabase
import { getCategoriesWithNominees } from '../api/get-categories';

export const useCategories = () => {
    const queryClient = useQueryClient(); // <--- Instanciar cliente

    const query = useQuery({
        queryKey: ['categories'],
        queryFn: getCategoriesWithNominees,
    });

    useEffect(() => {
        const channel = supabase
            .channel('realtime_nominees')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'nominees' },
                (payload) => {
                    console.log('🏆 Actualización de nominados detectada:', payload);
                    // Al detectar un cambio, invalidamos la caché para recargar automáticamente
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return query;
};