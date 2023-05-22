const API_KEY = "30b9835919252c28ccb9f37e2f04774e";
const BASE_PATH = "https://api.themoviedb.org/3";

//common result
interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
}

//Latest movies
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

//Top Rated Movies
export interface IGetTopMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

//Latest movies
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Top Rated Movies
export function getTopMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
