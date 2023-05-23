const API_KEY = "30b9835919252c28ccb9f37e2f04774e";
const BASE_PATH = "https://api.themoviedb.org/3";

//common result  interface
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
