const API_KEY = "30b9835919252c28ccb9f37e2f04774e";
const BASE_PATH = "https://api.themoviedb.org/3";

//common result interface
interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
  vote_average: number;
}

//Latest movies interface
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

//Top Rated Movies interface
export interface IGetTopMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

//Upcoming Movies interface
export interface IGetTopMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

//Latest Movies
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

//Upcoming Movies
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//common result interface
interface ITv {
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  id: number;
  vote_average: number;
}

//common data interface
export interface IGetTopTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

//Latest Shows TV
// export function getLatestTv() {
//   return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) =>
//     response.json()
//   );
// }

//Airing Today TV
export function getAiringTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Popular Tv
export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

//Top Rated Tv
export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//Search Movie and TV
export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
