import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFavorite } from "../../context/FavoriteContext";
import PoketmonCard from "../../components/PoketmonCard/PoketmonCard";
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
              korean_name: koreanName,
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
    <div className="favorite_container">
      <h2>❤️ 나의 포켓몬 ❤️</h2>
      {poketmonList.length === 0 ? (
        <p className="empty">아직 찜한 포켓몬이 없어요!</p>
      ) : (
        <div className="favorite_grid">
          {poketmonList.map((poketmon, index) => (
            <Link
              to={`/favorite/detail/${poketmon.id}`}
              key={poketmon.id}
              state={{
                fromFavorites: true,
                favoritesList: poketmonList,
                currentIndex: index,
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <PoketmonCard
                poketmon={poketmon}
                isFavorite={favorites.includes(poketmon.id)}
                onToggleFavorite={toggleFavorite}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
