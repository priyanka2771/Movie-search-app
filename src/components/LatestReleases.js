import React, { useState, useEffect } from "react";
import MovieRow from "./MovieRow";
import { fetchMovies } from "../api";

// OMDb has no "new releases" endpoint, so these are hand-picked recent films.
// Anything with a future release date is hidden until it comes out.
const COLLECTIONS = {
  hollywood: {
    label: "Hollywood",
    emoji: "🌎",
    ids: [
      "tt22084616", // Spider-Man: Brand New Day
      "tt33764258", // The Odyssey
      "tt27419466", // Moana
      "tt8814476", // Supergirl
      "tt29355505", // Toy Story 5
      "tt30825738", // The Mandalorian and Grogu
      "tt17490712", // Mortal Kombat II
      "tt33612209", // The Devil Wears Prada 2
      "tt11378946", // Michael
      "tt28650488", // The Super Mario Galaxy Movie
      "tt12042730", // Project Hail Mary
      "tt1757678", // Avatar: Fire and Ash
      "tt26443597", // Zootopia 2
      "tt19847976", // Wicked: For Good
    ],
  },
  indian: {
    label: "Indian",
    emoji: "🪔",
    ids: [
      "tt27988879", // Ramayana
      "tt33014583", // Dhurandhar
      "tt35661996", // Dashavatar (Marathi)
      "tt27441481", // Coolie
      "tt27425164", // War 2
      "tt28037987", // Saiyaara
      "tt36466927", // Jarann (Marathi)
      "tt27922706", // Chhaava
    ],
  },
};

const NEW_WINDOW_DAYS = 90;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// OMDb dates look like "31 Jul 2026"
function parseReleased(released) {
  const [day, month, year] = (released || "").split(" ");
  const monthIndex = MONTHS.indexOf(month);
  return monthIndex === -1 ? null : new Date(+year, monthIndex, +day);
}

function prepareReleases(movies) {
  const now = new Date();
  const newCutoff = new Date(now);
  newCutoff.setDate(now.getDate() - NEW_WINDOW_DAYS);

  return movies
    .map((movie) => ({ ...movie, releasedDate: parseReleased(movie.Released) }))
    .filter((movie) => movie.releasedDate && movie.releasedDate <= now)
    .sort((a, b) => b.releasedDate - a.releasedDate)
    .map((movie) => ({ ...movie, isNew: movie.releasedDate >= newCutoff }));
}

function LatestReleases({ onSelect }) {
  const [activeTab, setActiveTab] = useState("hollywood");
  const [moviesByTab, setMoviesByTab] = useState({});

  useEffect(() => {
    if (moviesByTab[activeTab]) return;

    fetchMovies(COLLECTIONS[activeTab].ids).then((movies) =>
      setMoviesByTab((prev) => ({
        ...prev,
        [activeTab]: prepareReleases(movies),
      })),
    );
  }, [activeTab, moviesByTab]);

  return (
    <section className="container home-section" id="latest-releases">
      <div className="section-header">
        <h2 className="section-title">
          🔥 Latest <span className="text-accent">Releases</span>
        </h2>
        <div className="lang-tabs" role="tablist">
          {Object.entries(COLLECTIONS).map(([key, collection]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={`lang-tab ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {collection.emoji} {collection.label}
            </button>
          ))}
        </div>
      </div>

      <MovieRow movies={moviesByTab[activeTab]} onSelect={onSelect} />
    </section>
  );
}

export default LatestReleases;
