import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFavorite } from "../../context/FavoriteContext";
import "./Favorite.scss";

const Favorite = () => {
  const { favorites, toggleFavorite } = useFavorite();
  const [poketmonList, setPoketmonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await Promise.all(
          favorites.map(async (id) => {
            const pokemonRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            const speciesRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${id}`
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

        setPoketmonList(data);
        setLoading(false);
      } catch (error) {
        console.error("찜 포켓몬 불러오기 오류:", error);
        setLoading(false);
      }
    };
    if (favorites.length > 0) {
      fetchFavorites();
    } else {
      setPoketmonList([]);
      setLoading(false);
    }
  }, [favorites]);

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="favorite-container">
      <h2>❤️ 나의 포켓몬 ❤️</h2>
      {poketmonList.length === 0 ? (
        <p className="empty">아직 찜한 포켓몬이 없어요!</p>
      ) : (
        <div className="favorite-grid">
          {poketmonList.map((pokemon) => (
            <Link
              to={`/detail/${pokemon.id}`}
              className="favorite-card"
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
                  ♥
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
