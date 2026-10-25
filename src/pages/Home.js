import React, { useState, useEffect, useCallback } from "react";
import IndianMovies from "../components/IndianMovies";
import LatestReleases from "../components/LatestReleases";
import MovieModal from "../components/MovieModal";
import { API_KEY, API_URL } from "../config";

// One search each keeps the home page to a couple of API calls
const POSTER_SEARCHES = ["marvel", "star wars"];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant search",
    text: "Find any movie or series by title in a split second.",
  },
  {
    icon: "⭐",
    title: "Ratings & reviews",
    text: "See IMDb ratings and vote counts at a glance.",
  },
  {
    icon: "🎭",
    title: "Cast & plot",
    text: "Dive into full plots, directors, cast and runtime.",
  },
];

const GENRES = [
  { label: "Superheroes", term: "Avengers", emoji: "🦸" },
  { label: "Sci-Fi", term: "Star Wars", emoji: "🚀" },
  { label: "Fantasy", term: "Harry Potter", emoji: "🧙" },
  { label: "Animation", term: "Toy Story", emoji: "🧸" },
  { label: "Thriller", term: "Mission Impossible", emoji: "🕵️" },
  { label: "Horror", term: "Conjuring", emoji: "👻" },
];

function Home({ onSearch }) {
  const [posters, setPosters] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const closeModal = useCallback(() => setSelectedMovie(null), []);

  useEffect(() => {
    Promise.all(
      POSTER_SEARCHES.map((term) =>
        fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(term)}&type=movie`)
          .then((res) => res.json())
          .catch(() => ({})),
      ),
    ).then((results) => {
      const all = results.flatMap((data) => data.Search || []);
      const withPosters = [
        ...new Map(
          all
            .filter((movie) => movie.Poster !== "N/A")
            .map((movie) => [movie.imdbID, movie]),
        ).values(),
      ];
      setPosters(withPosters);
    });
  }, []);

  const half = Math.ceil(posters.length / 2);
  const rows = [posters.slice(0, half), posters.slice(half)];

  return (
    <div className="home">
      {/* Hero with scrolling poster wall */}
      <section className="home-hero">
        <div className="poster-wall" aria-hidden="true">
          {rows.map((row, i) => (
            <div className={`poster-row ${i === 1 ? "reverse" : ""}`} key={i}>
              {/* Duplicated so the marquee loops seamlessly */}
              {[...row, ...row].map((movie, j) => (
                <img src={movie.Poster} alt="" key={`${movie.imdbID}-${j}`} />
              ))}
            </div>
          ))}
        </div>
        <div className="home-hero-fade" />

        <div className="home-hero-content container text-center">
          <span className="home-eyebrow">🍿 Your pocket movie guide</span>
          <h1 className="home-title">
            Discover movies <br />
            <span className="text-gradient">you'll love</span>
          </h1>
          <p className="home-subtitle">
            Explore thousands of films and series, check ratings, read plots and
            find out who's in the cast — all in one place.
          </p>

          <div className="home-cta">
            <button
              type="button"
              className="search-btn cta-btn"
              onClick={() => onSearch()}
            >
              🔍 Search Movies
            </button>
            <button
              type="button"
              className="ghost-btn cta-btn"
              onClick={() => onSearch("Avengers")}
            >
              Browse popular
            </button>
          </div>

          <div className="home-stats">
            <div>
              <strong>1M+</strong>
              <span>Titles</span>
            </div>
            <div>
              <strong>IMDb</strong>
              <span>Ratings</span>
            </div>
            <div>
              <strong>Free</strong>
              <span>Forever</span>
            </div>
          </div>
        </div>
      </section>

      <LatestReleases onSelect={setSelectedMovie} />

      {/* Features */}
      <section className="container home-section">
        <h2 className="section-title">
          Everything you need to <span className="text-accent">pick a movie</span>
        </h2>
        <div className="row g-4">
          {FEATURES.map((feature) => (
            <div className="col-md-4" key={feature.title}>
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <IndianMovies onSelect={setSelectedMovie} />

      {/* Genres */}
      <section className="container home-section">
        <h2 className="section-title">
          Start <span className="text-accent">exploring</span>
        </h2>
        <div className="genre-grid">
          {GENRES.map((genre) => (
            <button
              type="button"
              className="genre-tile"
              key={genre.label}
              onClick={() => onSearch(genre.term)}
            >
              <span className="genre-emoji">{genre.emoji}</span>
              <span className="genre-label">{genre.label}</span>
              <span className="genre-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="container home-section">
        <div className="cta-banner text-center">
          <h2>Ready to find your next watch?</h2>
          <p>Jump in and start searching — it only takes a second.</p>
          <button
            type="button"
            className="search-btn cta-btn"
            onClick={() => onSearch()}
          >
            Start Searching →
          </button>
        </div>
      </section>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default Home;
