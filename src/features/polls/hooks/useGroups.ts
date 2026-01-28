import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, getMyGroups, getGroupMembers } from '../api/groups';
import { useAuth } from '../../auth/context/AuthContext';

export const useGroups = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const groupsQuery = useQuery({
        queryKey: ['my_groups', user?.id],
        queryFn: getMyGroups,
        enabled: !!user
    });

    const createMutation = useMutation({
        mutationFn: (name: string) => createGroup(name, user!.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_groups'] })
    });

    return {
        groups: groupsQuery.data,
        isLoading: groupsQuery.isLoading,
        createGroup: createMutation.mutateAsync
    };
};

// Hook para sacar los miembros de un grupo activo
export const useGroupMembers = (groupId: string | null) => {
    return useQuery({
        queryKey: ['group_members', groupId],
        queryFn: () => getGroupMembers(groupId!),
        enabled: !!groupId // Solo corre si hay un grupo seleccionado
    });
};