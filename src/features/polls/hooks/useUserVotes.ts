import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserVotes, castVote } from '../api/votes';
import { useAuth } from '../../auth/context/AuthContext';
import { message } from 'antd';

export const useUserVotes = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: votes } = useQuery({
        queryKey: ['votes', user?.id],
        queryFn: () => getUserVotes(user!.id),
        enabled: !!user,
    });

    // 2. Mutation: Votar (con Optimistic Update)
    const mutation = useMutation({
        mutationFn: castVote,
        // Antes de que la petición salga a internet...
        onMutate: async (newVote) => {
            // Cancelar cualquier refetch en curso para que no sobrescriba nuestro optimismo
            await queryClient.cancelQueries({ queryKey: ['votes', user?.id] });

            // Guardar el estado anterior por si falla
            const previousVotes = queryClient.getQueryData(['votes', user?.id]);

            // Actualizar el caché localmente como si ya hubiera sido exitoso
            queryClient.setQueryData(['votes', user?.id], (old: any[]) => {
                // Filtramos el voto anterior de esta categoría y añadimos el nuevo
                const filtered = old ? old.filter((v: any) => v.category_id !== newVote.categoryId) : [];
                return [...filtered, {
                    category_id: newVote.categoryId,
                    nominee_id: newVote.nomineeId,
                    user_id: user?.id
                }];
            });

            return { previousVotes };
        },
        onError: (err, _newVote, context) => {
            queryClient.setQueryData(['votes', user?.id], context?.previousVotes);
            message.error('No se pudo guardar el voto: ' + err.message);
        },
        onSettled: () => {
            // Al final, sincronizamos con el servidor por si acaso
            queryClient.invalidateQueries({ queryKey: ['votes', user?.id] });
        },
    });

    return {
        votes,
        castVote: mutation.mutate,
        isVoting: mutation.isPending
    };
};