export const config = { runtime: 'edge' };

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default async (request: Request): Promise<Response> => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('query');

    if (!type || !query) {
        return new Response(JSON.stringify({ error: 'Missing type or query parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'TMDB API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const endpoint = type === 'person' ? 'search/person' : 'search/movie';
    const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?query=${encodeURIComponent(query)}&api_key=${apiKey}`;

    const tmdbResponse = await fetch(tmdbUrl);
    if (!tmdbResponse.ok) {
        return new Response(JSON.stringify({ error: 'TMDB request failed' }), {
            status: tmdbResponse.status,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const data = await tmdbResponse.json();
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
