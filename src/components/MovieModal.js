import React, { useEffect } from "react";

// `movie` arrives already loaded (the card fetches it), or as { Error } on failure
function MovieModal({ movie, onClose }) {
  const details = movie.Error ? null : movie;
  const error = movie.Error;

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const has = (value) => value && value !== "N/A";

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {error && (
          <div className="modal-status">
            <div className="empty-icon">😕</div>
            <p>{error}</p>
          </div>
        )}

        {details && (
          <div className="modal-content-grid">
            <div className="modal-poster">
              {has(details.Poster) ? (
                <img src={details.Poster} alt={details.Title} />
              ) : (
                <div className="poster-fallback">
                  <span>🎞️</span>
                  <small>No poster</small>
                </div>
              )}
            </div>

            <div className="modal-body-custom">
              <h2 className="modal-title-custom">{details.Title}</h2>

              <div className="modal-meta">
                {has(details.Year) && <span>{details.Year}</span>}
                {has(details.Rated) && (
                  <span className="meta-pill">{details.Rated}</span>
                )}
                {has(details.Runtime) && <span>⏱ {details.Runtime}</span>}
              </div>

              {has(details.Genre) && (
                <div className="genre-list">
                  {details.Genre.split(", ").map((genre) => (
                    <span className="chip" key={genre}>
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {has(details.imdbRating) && (
                <div className="rating">
                  <span className="rating-star">★</span>
                  <span className="rating-value">{details.imdbRating}</span>
                  <span className="rating-max">/ 10</span>
                  {has(details.imdbVotes) && (
                    <span className="rating-votes">
                      {details.imdbVotes} votes
                    </span>
                  )}
                </div>
              )}

              {has(details.Plot) && <p className="modal-plot">{details.Plot}</p>}

              <dl className="modal-facts">
                {has(details.Director) && (
                  <>
                    <dt>Director</dt>
                    <dd>{details.Director}</dd>
                  </>
                )}
                {has(details.Actors) && (
                  <>
                    <dt>Cast</dt>
                    <dd>{details.Actors}</dd>
                  </>
                )}
                {has(details.Language) && (
                  <>
                    <dt>Language</dt>
                    <dd>{details.Language}</dd>
                  </>
                )}
                {has(details.BoxOffice) && (
                  <>
                    <dt>Box office</dt>
                    <dd>{details.BoxOffice}</dd>
                  </>
                )}
              </dl>

              <a
                className="search-btn imdb-link"
                href={`https://www.imdb.com/title/${details.imdbID}/`}
                target="_blank"
                rel="noreferrer"
              >
                View on IMDb ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
