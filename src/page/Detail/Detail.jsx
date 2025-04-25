import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFavorite } from "../../context/FavoriteContext";
import "./Detail.scss";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

        const koreanName =
          speciesRes.data.names.find((name) => name.language.name === "ko")?.name ||
          pokemonRes.data.name;

        const flavorText =
          speciesRes.data.flavor_text_entries.find(
            (entry) => entry.language.name === "ko"
          )?.flavor_text.replace(/\n|\f/g, " ") || "";

        const evolutionUrl = speciesRes.data.evolution_chain.url;
        const evolutionRes = await axios.get(evolutionUrl);
        const chain = evolutionRes.data.chain;

        const evolutionList = [];
        let current = chain;

        while (current) {
          const evoId = current.species.url.split("/").filter(Boolean).pop();
          const name = current.species.name;
          evolutionList.push({ name, id: evoId });
          current = current.evolves_to[0];
        }

        setPokemon({
          id: pokemonRes.data.id,
          name: pokemonRes.data.name,
          koreanName,
          image: pokemonRes.data.sprites.front_default,
          types: pokemonRes.data.types,
          stats: pokemonRes.data.stats,
        });

        setDescription(flavorText);
        setEvolution(evolutionList);
        setLoading(false);
      } catch (error) {
        console.error("상세 정보 로딩 실패", error);
      }
    };

    fetchData();
  }, [id]);

  if (loading || !pokemon) return <div className="loading">로딩 중...</div>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <img src={pokemon.image} alt={pokemon.koreanName} />
        <h2>
          {pokemon.koreanName}
          <button
            className="heart-btn"
            onClick={() => toggleFavorite(pokemon.id)}
          >
            {favorites.includes(pokemon.id) ? "♥" : "♡"}
          </button>
        </h2>
        <p className="eng-name">({pokemon.name})</p>

        {description && <p className="description">{description}</p>}

        <div className="types">
          <div className="type-list">
            {pokemon.types.map((type, index) => (
              <span key={index} className={`type-badge ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="stats-toggle">
          <button onClick={() => setShowStats(!showStats)}>
            {showStats ? "능력치 접기 ▲" : "능력치 보기 ▼"}
          </button>
        </div>

        {showStats && (
          <div className="stats">
            <ul>
              {pokemon.stats.map((stat, index) => (
                <li key={index}>
                  {stat.stat.name}: {stat.base_stat}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="evolution">
          <h4>진화 정보</h4>
          <div className="evolution-chain">
            {evolution.map((evo, index) => (
              <div
                key={index}
                className="evolution-item"
                onClick={() => navigate(`/detail/${evo.id}`)}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                  alt={evo.name}
                />
                <p>{evo.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;


