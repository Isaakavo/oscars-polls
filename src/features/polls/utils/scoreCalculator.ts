import type {Category} from '../api/get-categories';

export interface UserScore {
    userId: string;
    fullName: string;
    avatarUrl: string;
    score: number;
    totalVotes: number;
}

export const calculateLeaderboard = (allVotes: any[], categories: Category[]): UserScore[] => {
    if (!allVotes || !categories) return [];

    // 1. Crear un Set con los IDs de los ganadores para búsqueda rápida O(1)
    const winningNomineeIds = new Set<number>();
    categories.forEach((cat) => {
        cat.nominees.forEach((nom) => {
            if (nom.is_winner) {
                winningNomineeIds.add(nom.id);
            }
        });
    });

    // 2. Agrupar puntos por usuario
    const scoresMap = new Map<string, UserScore>();

    allVotes.forEach((vote) => {
        const userId = vote.user_id;

        // Inicializar usuario si no existe en el mapa
        if (!scoresMap.has(userId)) {
            scoresMap.set(userId, {
                userId: userId,
                fullName: vote.profiles?.full_name || 'Anónimo',
                avatarUrl: vote.profiles?.avatar_url || '',
                score: 0,
                totalVotes: 0
            });
        }

        const userStat = scoresMap.get(userId)!;
        userStat.totalVotes += 1;

        // Si votó por un ganador, sumar punto
        if (winningNomineeIds.has(vote.nominee_id)) {
            userStat.score += 1;
        }
    });

    // 3. Convertir a array y ordenar (Mayor puntaje primero)
    return Array.from(scoresMap.values()).sort((a, b) => b.score - a.score);
};