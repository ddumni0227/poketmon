import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFavorite } from "../../context/FavoriteContext";
import "./Detail.scss";

const getKoreanName = async (id, fallbackName) => {
  try {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );
    return (
      res.data.names.find((name) => name.language.name === "ko")?.name ||
      fallbackName
    );
  } catch {
    return fallbackName;
  }
};

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();

  const fromFavorites = location.state?.fromFavorites;
  const favoritesList = location.state?.favoritesList || [];
  const currentIndex = location.state?.currentIndex ?? -1;

  const [poketmon, setPoketmon] = useState(null);
  const [description, setDescription] = useState("");
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poketmonRes = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const speciesRes = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );

        const korean_name =
          speciesRes.data.names.find((name) => name.language.name === "ko")
            ?.name || poketmonRes.data.name;

        const flavorText =
          speciesRes.data.flavor_text_entries
            .find((entry) => entry.language.name === "ko")
            ?.flavor_text.replace(/\n|\f/g, " ") || "";

        const evolutionUrl = speciesRes.data.evolution_chain.url;
        const evolutionRes = await axios.get(evolutionUrl);
        const chain = evolutionRes.data.chain;

        const evolutionList = [];
        let current = chain;
        while (current) {
          const evoId = current.species.url.split("/").filter(Boolean).pop();
          const evoName = current.species.name;
          const evoKoreanName = await getKoreanName(evoId, evoName);
          evolutionList.push({
            id: evoId,
            name: evoName,
            korean_name: evoKoreanName,
          });
          current = current.evolves_to[0];
        }

        setPoketmon({
          id: poketmonRes.data.id,
          name: poketmonRes.data.name,
          korean_name,
          image: poketmonRes.data.sprites.front_default,
          types: poketmonRes.data.types,
          stats: poketmonRes.data.stats,
        });

        setDescription(flavorText);
        setEvolution(evolutionList);
        setLoading(false);
      } catch (err) {
        console.error("상세 정보 로딩 실패", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMove = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < favoritesList.length) {
      const next = favoritesList[newIndex];
      navigate(`/detail/${next.id}`, {
        state: {
          fromFavorites: true,
          favoritesList,
          currentIndex: newIndex,
        },
      });
    }
  };

  if (loading || !poketmon) return <div className="loading">로딩 중...</div>;

  return (
    <div className="detail_container">
      <div className="detail_card">
        <img src={poketmon.image} alt={poketmon.korean_name} />
        <h2>
          {poketmon.korean_name}
          <button
            className="heart_btn"
            onClick={() => toggleFavorite(poketmon.id)}
          >
            {favorites.includes(poketmon.id) ? "♥" : "♡"}
          </button>
        </h2>
        <p className="eng_name">({poketmon.name})</p>

        {description && <p className="description">{description}</p>}

        <div className="type_list">
          {poketmon.types.map((type, idx) => (
            <span key={idx} className={`type_badge ${type.type.name}`}>
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="stats_toggle">
          <button onClick={() => setShowStats(!showStats)}>
            {showStats ? "능력치 접기 ▲" : "능력치 보기 ▼"}
          </button>
        </div>

        {showStats && (
          <ul className="stats">
            {poketmon.stats.map((stat, idx) => (
              <li key={idx}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        )}

        <div className="evolution">
          <h4>진화 정보</h4>
          <div className="evolution_chain">
            {evolution.map((evo, idx) => (
              <div
                key={idx}
                className="evolution_item"
                onClick={() => navigate(`/detail/${evo.id}`)}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                  alt={evo.korean_name}
                />
                <p>{evo.korean_name}</p>
              </div>
            ))}
          </div>
        </div>

        {fromFavorites && (
          <div className="nav_buttons">
            <button
              onClick={() => handleMove(-1)}
              disabled={currentIndex === 0}
            >
              ◀ 이전
            </button>
            <button
              onClick={() => handleMove(1)}
              disabled={currentIndex === favoritesList.length - 1}
            >
              다음 ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
