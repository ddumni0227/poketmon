import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Main.scss";
import { useFavorite } from "../../context/FavoriteContext";

const Main = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayCount, setDisplayCount] = useState(42);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorites } = useFavorite();

  useEffect(() => {
    const fetchPoketmons = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=280"
        );
        const { results } = response.data;

        const pokemonData = await Promise.all(
          results.map(async (pokemon) => {
            const pokemonRes = await axios.get(pokemon.url);
            const speciesRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${pokemonRes.data.id}`
            );
            const koreanName =
              speciesRes.data.names.find((name) => name.language.name === "ko")
                ?.name || pokemonRes.data.name;

            return {
              id: pokemonRes.data.id,
              name: pokemonRes.data.name,
              koreanName,
              image: pokemonRes.data.sprites.front_default,
            };
          })
        );

        setPokemonList(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error("포켓몬 데이터 로딩 오류:", error);
        setLoading(false);
      }
    };

    fetchPoketmons();
  }, []);

  const toggleFavorite = (id) => {
    toggleFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 42, pokemonList.length));
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="main-bg">
      <div className="poketmon_grid">
        {pokemonList.slice(0, displayCount).map((pokemon) => (
          <Link
            to={`/detail/${pokemon.id}`}
            className="poketmon_card"
            key={pokemon.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={pokemon.image} alt={pokemon.koreanName} />
            <div className="poketmon_name">
              {pokemon.koreanName}
              <button
                className="heart_btn"
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

      {/* 더보기 버튼 */}
      {displayCount < pokemonList.length && (
        <div className="load-more">
          <button onClick={handleLoadMore}>더보기 ▽</button>
        </div>
      )}
    </div>
  );
};

export default Main;
