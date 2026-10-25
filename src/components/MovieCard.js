import React, { useState } from "react";

function MovieCard({ movie, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const hasPoster = movie.Poster !== "N/A" && !imgError;

  return (
    <button
      type="button"
      className="movie-card"
      onClick={() => onSelect(movie.imdbID)}
      title={movie.Title}
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
        <span className="type-badge">{movie.Type}</span>

        <div className="poster-overlay">
          <span className="view-btn">View details</span>
        </div>
      </div>

      <div className="movie-info">
        <h6 className="movie-title">{movie.Title}</h6>
      </div>
    </button>
  );
}

export default MovieCard;
