import { supabase } from '../../../lib/supabase';

// 1. Crear un grupo
export const createGroup = async (name: string, userId: string) => {
    const { data, error } = await supabase
        .from('groups')
        .insert({ name, created_by: userId })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// 2. Obtener los grupos a los que pertenezco
export const getMyGroups = async () => {
    const { data, error } = await supabase
        .from('groups')
        .select('*'); // RLS se encarga de filtrar solo los míos

    if (error) throw new Error(error.message);
    return data;
};

// 3. Unirse a un grupo usando el código (Lógica "Mágica")
export const joinGroupByCode = async (code: string, userId: string) => {
    // A. Buscar el ID del grupo basado en el código (Usamos una función RPC o query directa saltando RLS temporalmente es complejo,
    // así que haremos un truco: select con filtro de código).
    // Nota: Para que esto funcione con RLS, necesitamos una política especial o usar una Edge Function.
    // SIMPLIFICACIÓN: Haremos una función RPC (Stored Procedure) en Supabase para evitar líos de permisos al buscar por código.

    const { data, error } = await supabase.rpc('join_group_by_code', {
        p_invite_code: code,
        p_user_id: userId
    });

    if (error) throw new Error(error.message);
    return data; // Retorna el group_id si tuvo éxito
};

// 4. Obtener miembros de un grupo específico (para el leaderboard)
export const getGroupMembers = async (groupId: string) => {
    const { data, error } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

    if (error) throw new Error(error.message);
    return data.map((m: any) => m.user_id); // Retorna array de IDs ['id1', 'id2']
};