import React from "react";
import MovieCard from "./MovieCard";

// Horizontally scrolling row of cards; shows skeletons while `movies` is null
function MovieRow({ movies, onSelect }) {
  return (
    <div className="movie-row">
      {movies
        ? movies.map((movie) => (
            <div className="movie-row-item" key={movie.imdbID}>
              <MovieCard movie={movie} onSelect={onSelect} />
            </div>
          ))
        : Array.from({ length: 6 }).map((_, i) => (
            <div className="movie-row-item" key={i}>
              <div className="skeleton-card" />
            </div>
          ))}
    </div>
  );
}

export default MovieRow;
