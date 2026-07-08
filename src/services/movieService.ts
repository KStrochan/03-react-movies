import axios from 'axios';
import type { TMDBResponse } from '../types/movie';

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (query: string, page: number = 1): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>('https://api.themoviedb.org/3/search/movie', {
    params: {
      query: query,
      include_adult: false,
      language: 'en-US',
      page: page, // Тепер сторінка передається динамічно для "Load more"
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
};