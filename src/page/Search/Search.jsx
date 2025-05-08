import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Search.scss";
import { useLocation } from "react-router-dom";
import { useFavorite } from "../../context/FavoriteContext";

const Search = () => {
  const { favorites, toggleFavorite } = useFavorite();
  const location = useLocation();
  const savedKeyword = localStorage.getItem("searchKeyword") || "";
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(16);

  useEffect(() => {
    if (!savedKeyword) return;

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

          if (koreanName.includes(savedKeyword)) {
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
  }, [savedKeyword]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 16, result.length));
  };

  return (
    <div className="search-container">
      <h3 className="result-text">
        🔍 <strong>' {savedKeyword} '</strong> 검색결과 총{" "}
        <strong>{result.length}</strong> 건
      </h3>

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
