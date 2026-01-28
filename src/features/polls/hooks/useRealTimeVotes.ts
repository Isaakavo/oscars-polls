import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { getAllVotes } from '../api/votes';

export const useRealtimeVotes = () => {
    const queryClient = useQueryClient();

    const { data: allVotes, isLoading } = useQuery({
        queryKey: ['all_votes'],
        queryFn: getAllVotes,
    });

    useEffect(() => {
        const channel = supabase
            .channel('realtime_votes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'votes' },
                (payload) => {
                    console.log('Cambio detectado en DB:', payload);
                    queryClient.invalidateQueries({ queryKey: ['all_votes'] });
                }
            )
            .subscribe();

        // Limpieza al desmontar el componente
        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return { allVotes, isLoading };
};