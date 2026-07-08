import axios from 'axios';
import type { Movie } from '../types/movie';

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (query: string, page: number = 1): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>('https://api.themoviedb.org/3/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page: page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
};