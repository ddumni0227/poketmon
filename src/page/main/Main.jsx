import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.scss";

const Main = () => {
  const [pokemonList, setPoketmonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // 찜한 포켓몬 id 배열

  useEffect(() => {
    const fetchPoketmons = async () => {
      try {
        // 1~12번 예시만 가져오기 (원하면 limit 조절)
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
        const { results } = response.data;

        const poketmonData = await Promise.all(
          results.map(async (pokemon) => {
            const poketmonRes = await axios.get(pokemon.url);
            const speciesRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${poketmonRes.data.id}`
            );
            const koreanName = speciesRes.data.names.find(
              (name) => name.language.name === "ko"
            )?.name || poketmonRes.data.name;
            return {
              id: poketmonRes.data.id,
              name: poketmonRes.data.name,
              koreanName: koreanName,
              image: poketmonRes.data.sprites.front_default,
            };
          })
        );
        setPoketmonList(poketmonData);
        setLoading(false);
      } catch (error) {
        console.error("포켓몬 데이터 로딩 오류:", error);
        setLoading(false);
      }
    };

    fetchPoketmons();
  }, []);

  // 하트(찜) 토글 함수
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="main-bg">
      <div className="poketmon_grid">
        {pokemonList.map((pokemon) => (
          <div className="poketmon_card" key={pokemon.id}>
            <img src={pokemon.image} alt={pokemon.koreanName} />
            <div className="poketmon_name">
              {pokemon.koreanName}
              <button
                className="heart_btn"
                onClick={() => toggleFavorite(pokemon.id)}
                aria-label="찜하기"
              >
                {favorites.includes(pokemon.id) ? "♥" : "♡"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;


