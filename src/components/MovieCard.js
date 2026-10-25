import React, { useState, useRef } from "react";
import { fetchMovie } from "../api";

function MovieCard({ movie, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState(null);
  const cardRef = useRef(null);
  const hasPoster = movie.Poster !== "N/A" && !imgError;
  const hasRating = movie.imdbRating && movie.imdbRating !== "N/A";

  // Tilt toward the cursor and move the shine highlight with it
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  };

  const handleMouseLeave = () => {
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
  };

  const handleClick = (e) => {
    if (loading) return;

    const rect = cardRef.current.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
    setLoading(true);

    // Load the full details first so the modal opens ready to read
    fetchMovie(movie.imdbID, { fullPlot: true }).then((details) => {
      setLoading(false);
      onSelect(details || { Error: "Could not load movie details." });
    });
  };

  return (
    <button
      type="button"
      ref={cardRef}
      className={`movie-card ${loading ? "is-loading" : ""}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      title={movie.Title}
      aria-busy={loading}
    >
      <div className="poster-wrap">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="poster-fallback">
            <span>🎞️</span>
            <small>No poster</small>
          </div>
        )}

        <span className="year-badge">{movie.Year}</span>
        {movie.isNew ? (
          <span className="type-badge new-badge">New</span>
        ) : (
          <span className="type-badge">{movie.Type}</span>
        )}
        {hasRating && <span className="rating-badge">★ {movie.imdbRating}</span>}

        <div className="card-shine" />

        <div className="poster-overlay">
          <span className="view-btn">▶ View details</span>
        </div>

        {loading && (
          <div className="card-loading">
            <div className="reel-spinner" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h6 className="movie-title">{movie.Title}</h6>
      </div>

      {ripple && (
        <span
          className="ripple"
          key={ripple.key}
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => setRipple(null)}
        />
      )}
    </button>
  );
}

export default MovieCard;
