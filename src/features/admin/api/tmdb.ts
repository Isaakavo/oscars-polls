const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string) => {
    if (!query) return [];

    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`);
    const data = await response.json();

    return data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image',
        release_date: movie.release_date
    }));
};

export const searchPeople = async (query: string) => {
    if (!query) return [];

    const response = await fetch(`${BASE_URL}/search/person?query=${encodeURIComponent(query)}&api_key=${API_KEY}`)
    const data = await response.json();

    if(!data.results) return [];

    return data.results.map((person: any) => ({
        id: person.id,
        title: person.name,
        poster_path: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : null,
        known_for: person.knonw_for,
    }));
}
