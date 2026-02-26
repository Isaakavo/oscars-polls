import {useQuery} from '@tanstack/react-query';
import {supabase} from '../../../lib/supabase';

export const useVotingStatus = () => {
    return useQuery({
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
};
