import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tmdb-dev-proxy',
      configureServer(server) {
        server.middlewares.use('/api/tmdb', async (req, res) => {
          const url = new URL(req.url!, 'http://localhost');
          const type = url.searchParams.get('type');
          const query = url.searchParams.get('query');
          const apiKey = process.env.TMDB_API_KEY;

          const endpoint = type === 'person' ? 'search/person' : 'search/movie';
          const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?query=${encodeURIComponent(query ?? '')}&api_key=${apiKey}`;

          const tmdbResponse = await fetch(tmdbUrl);
          const data = await tmdbResponse.json();

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        });
      },
    },
  ],
})
