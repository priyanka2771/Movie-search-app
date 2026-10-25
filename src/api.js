import { API_KEY, API_URL } from "./config";

// Fetch one movie from either an IMDb ID ("tt...") or a [title, year] pair.
// Resolves to null when OMDb can't find it, so lists can just filter it out.
export function fetchMovie(entry, { fullPlot = false } = {}) {
  const query =
    typeof entry === "string"
      ? `i=${entry}`
      : `t=${encodeURIComponent(entry[0])}&y=${entry[1]}`;
  const plot = fullPlot ? "&plot=full" : "";

  return fetch(`${API_URL}?apikey=${API_KEY}&${query}${plot}`)
    .then((res) => res.json())
    .then((data) => (data.Response === "True" ? data : null))
    .catch(() => null);
}

export function fetchMovies(entries) {
  return Promise.all(entries.map((entry) => fetchMovie(entry))).then(
    (results) => [
      ...new Map(
        results.filter(Boolean).map((movie) => [movie.imdbID, movie]),
      ).values(),
    ],
  );
}
