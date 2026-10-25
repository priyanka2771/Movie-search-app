import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";

const DEFAULT_SEARCH = "batman";

// Hash routes (#/ and #/search?q=...) work on GitHub Pages without server config
function readRoute() {
  const [path, query = ""] = window.location.hash.replace(/^#/, "").split("?");
  return {
    page: path === "/search" ? "search" : "home",
    term: new URLSearchParams(query).get("q") || DEFAULT_SEARCH,
  };
}

function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const goToSearch = (term = DEFAULT_SEARCH) => {
    window.location.hash = `/search?q=${encodeURIComponent(term)}`;
  };

  return (
    <div className="app min-vh-100 text-white">
      {/* Navbar */}
      <nav className="navbar app-navbar px-4 sticky-top">
        <a href="#/" className="navbar-brand brand fw-bold">
          🎬 Movie<span className="text-accent">Explorer</span>
        </a>
        <div className="nav-links">
          <a href="#/" className={route.page === "home" ? "active" : ""}>
            Home
          </a>
          <a
            href="#/search"
            className={route.page === "search" ? "active" : ""}
          >
            Search
          </a>
        </div>
      </nav>

      {route.page === "home" ? (
        <Home onSearch={goToSearch} />
      ) : (
        <SearchPage searchTerm={route.term} setSearchTerm={goToSearch} />
      )}

      <footer className="app-footer">
        Data from <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a>
      </footer>
    </div>
  );
}

export default App;
