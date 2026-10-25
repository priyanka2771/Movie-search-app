import React, { useState, useEffect } from "react";
import MovieRow from "./MovieRow";
import { fetchMovies } from "../api";

// OMDb can't filter by language, so each tab is a hand-picked list.
// Entries are [title, year], or an IMDb ID where OMDb's title/year lookup misses.
const COLLECTIONS = {
  hindi: {
    label: "Hindi",
    emoji: "🎬",
    titles: [
      ["3 Idiots", 2009],
      ["Dangal", 2016],
      ["12th Fail", 2023],
      ["Lagaan", 2001],
      "tt0112870", // Dilwale Dulhania Le Jayenge
      ["Zindagi Na Milegi Dobara", 2011],
      ["Andhadhun", 2018],
      ["PK", 2014],
      "tt0986264", // Taare Zameen Par
      "tt0405508", // Rang De Basanti
      ["Sholay", 1975],
    ],
  },
  marathi: {
    label: "Marathi",
    emoji: "🚩",
    titles: [
      ["Sairat", 2016],
      ["Natsamrat", 2016],
      ["Court", 2014],
      ["Fandry", 2013],
      ["Killa", 2014],
      ["Harishchandrachi Factory", 2009],
      ["Duniyadari", 2013],
      ["Natarang", 2010],
      ["Naal", 2018],
      ["Pawankhind", 2022],
      ["Mulshi Pattern", 2018],
      ["Baipan Bhari Deva", 2023],
    ],
  },
  south: {
    label: "South Indian",
    emoji: "🌴",
    titles: [
      ["Baahubali: The Beginning", 2015],
      ["RRR", 2022],
      ["K.G.F: Chapter 1", 2018],
      ["Kantara", 2022],
      ["Vikram", 2022],
      ["Jai Bhim", 2021],
      ["Drishyam", 2013],
      ["Kumbalangi Nights", 2019],
      ["Premam", 2015],
      ["Super Deluxe", 2019],
    ],
  },
};

function IndianMovies({ onSelect }) {
  const [activeTab, setActiveTab] = useState("hindi");
  const [moviesByTab, setMoviesByTab] = useState({});

  // Load each tab only the first time it's opened
  useEffect(() => {
    if (moviesByTab[activeTab]) return;

    fetchMovies(COLLECTIONS[activeTab].titles).then((movies) =>
      setMoviesByTab((prev) => ({ ...prev, [activeTab]: movies })),
    );
  }, [activeTab, moviesByTab]);

  return (
    <section className="container home-section" id="indian-cinema">
      <h2 className="section-title">
        🎞️ Best of <span className="text-accent">Indian Cinema</span>
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

      <MovieRow movies={moviesByTab[activeTab]} onSelect={onSelect} />
    </section>
  );
}

export default IndianMovies;
