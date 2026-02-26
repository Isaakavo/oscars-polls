import {useEffect} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {supabase} from '../../../lib/supabase';

export const useVotingStatus = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['voting_status'],
        queryFn: async () => {
            const {data, error} = await supabase
                .from('app_settings')
                .select('voting_closed')
                .single();

            if (error) throw new Error(error.message);
            return data.voting_closed as boolean;
        },
    });

    useEffect(() => {
        const channel = supabase
            .channel('realtime_voting_status')
            .on(
                'postgres_changes',
                {event: 'UPDATE', schema: 'public', table: 'app_settings'},
                () => {
                    queryClient.invalidateQueries({queryKey: ['voting_status']});
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return query;
};
