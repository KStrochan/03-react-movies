import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showBtn, setShowBtn] = useState<boolean>(false);

  useEffect(() => {
    if (!query) return;

    async function getMovies() {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await fetchMovies(query, page);

        if (data.results.length === 0) {
          toast.error('No movies found for your request!');
          return;
        }

        setMovies((prevMovies) => [...prevMovies, ...data.results]);
        setShowBtn(data.page < data.total_pages);
      } catch {
        setIsError(true);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    getMovies();
  }, [query, page]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setMovies([]);
    setPage(1);
    setShowBtn(false);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.appContainer}>
      <SearchBar onSubmit={handleSearch} />
      
      {isError && <ErrorMessage />}
      
      {movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={openModal} />
      )}
      
      {isLoading && <Loader />}
      
      {showBtn && !isLoading && (
        <button 
          type="button" 
          onClick={handleLoadMore} 
          className={css.loadMoreBtn}
        >
          Load more
        </button>
      )}
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      {/* Глобальний компонент для сповіщень react-hot-toast */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}