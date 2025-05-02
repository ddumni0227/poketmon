import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Search.scss";
import { useFavorite } from "../../context/FavoriteContext";

const Search = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();

  const savedKeyword = localStorage.getItem("searchKeyword") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKeyword, setActiveKeyword] = useState(savedKeyword);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(16);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    localStorage.setItem("searchKeyword", searchTerm.trim());
    setActiveKeyword(searchTerm.trim());
    setSearchTerm("");
    setDisplayCount(16);
    navigate("/search");
  };

  useEffect(() => {
    if (!activeKeyword) return;

    const fetchSearchResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=150"
        );
        const { results } = response.data;

        const detailed = [];

        for (const pokemon of results) {
          const res = await axios.get(pokemon.url);
          const species = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${res.data.id}`
          );
          const koreanName =
            species.data.names.find((name) => name.language.name === "ko")
              ?.name || res.data.name;

          if (koreanName.includes(activeKeyword)) {
            detailed.push({
              id: res.data.id,
              name: res.data.name,
              koreanName,
              image: res.data.sprites.front_default,
            });
          }
        }

        setResult(detailed);
      } catch (err) {
        console.error("검색 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResult();
  }, [activeKeyword]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 16, result.length));
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="포켓몬 이름 검색하기"
        />
        <button type="submit">🔍</button>
      </form>

      {activeKeyword && (
        <h3 className="result-text">
          🔍 <strong>' {activeKeyword} '</strong> 검색결과 총 {""}
          <strong>{result.length}</strong> 건
        </h3>
      )}

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <>
          <div className="search-grid">
            {result.slice(0, displayCount).map((pokemon) => (
              <Link
                to={`/detail/${pokemon.id}`}
                className="search-card"
                key={pokemon.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={pokemon.image} alt={pokemon.koreanName} />
                <div className="pokemon-name">
                  {pokemon.koreanName}
                  <button
                    className="heart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(pokemon.id);
                    }}
                  >
                    {favorites.includes(pokemon.id) ? "♥" : "♡"}
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {displayCount < result.length && (
            <div className="load-more">
              <button onClick={handleLoadMore}>더보기 ▽</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
