import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";

const QUICK_SEARCHES = ["Batman", "Avengers", "Harry Potter", "Star Wars", "Inception", "Spider-Man"];

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("batman");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const closeModal = useCallback(() => setSelectedId(null), []);

  const API_KEY = "e7faec0f";

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) {
          const uniqueMovies = [
            ...new Map(
              data.Search.map((movie) => [movie.imdbID, movie]),
            ).values(),
          ];

          const sortedMovies = uniqueMovies.sort(
            (a, b) => parseInt(b.Year) - parseInt(a.Year),
          );

          setMovies(sortedMovies);
        } else {
          setMovies([]);
        }
      })
      .catch(() => {
        setMovies([]);
        setError("Something went wrong. Please check your connection.");
      })
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="app min-vh-100 text-white">
      {/* Navbar */}
      <nav className="navbar app-navbar px-4 sticky-top">
        <span className="navbar-brand brand fw-bold">
          🎬 Movie<span className="text-accent">Explorer</span>
        </span>
      </nav>

      {/* Hero */}
      <header className="hero text-center">
        <div className="container">
          <h1 className="hero-title">
            Find your next <span className="text-gradient">favorite film</span>
          </h1>
          <p className="hero-subtitle">
            Search thousands of movies and series in seconds.
          </p>

          <SearchBar setSearchTerm={setSearchTerm} />

          <div className="quick-searches">
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                className={`chip ${
                  searchTerm.toLowerCase() === term.toLowerCase() ? "active" : ""
                }`}
                onClick={() => setSearchTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container pb-5">
        {!loading && movies.length > 0 && (
          <h2 className="results-heading">
            Results for <span className="text-accent">"{searchTerm}"</span>
            <span className="results-count">{movies.length} titles</span>
          </h2>
        )}

        <div className="row g-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={i}>
                  <div className="skeleton-card" />
                </div>
              ))
            : movies.map((movie) => (
                <div
                  className="col-6 col-md-4 col-lg-3 col-xl-2"
                  key={movie.imdbID}
                >
                  <MovieCard movie={movie} onSelect={setSelectedId} />
                </div>
              ))}
        </div>

        {!loading && movies.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎥</div>
            <h3>{error ? "Oops!" : "No movies found"}</h3>
            <p>{error || "Try another title or pick one of the suggestions above."}</p>
          </div>
        )}
      </main>

      {selectedId && (
        <MovieModal imdbID={selectedId} apiKey={API_KEY} onClose={closeModal} />
      )}

      <footer className="app-footer">
        Data from <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a>
      </footer>
    </div>
  );
}

export default App;
