import { useEffect, useState } from "react";
import axios from "axios";
import "./Main.scss";
import { useFavorite } from "../../context/FavoriteContext";
import PoketmonCard from "../../components/PoketmonCard/PoketmonCard";
import { Link } from "react-router-dom";
import FilterBar from "../../components/Filter/Filter";

const Main = () => {
  const [poketmonList, setPoketmonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("전체");
  const [nameSort, setNameSort] = useState("id");
  const [expSort, setExpSort] = useState("");
  const [statSort, setStatSort] = useState("");

  const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchPoketmons = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const { results } = response.data;

        const data = await Promise.all(
          results.map(async (poketmon) => {
            const detailRes = await axios.get(poketmon.url);
            const speciesRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${detailRes.data.id}`
            );
            const koreanName =
              speciesRes.data.names.find((name) => name.language.name === "ko")
                ?.name || detailRes.data.name;

            return {
              id: detailRes.data.id,
              name: detailRes.data.name,
              korean_name: koreanName,
              image: detailRes.data.sprites.front_default,
              types: detailRes.data.types.map((t) => t.type.name),
              base_experience: detailRes.data.base_experience,
              stats: detailRes.data.stats,
            };
          })
        );

        setPoketmonList(data);
        setLoading(false);
      } catch (err) {
        console.error("포켓몬 로딩 오류", err);
        setLoading(false);
      }
    };

    fetchPoketmons();
  }, []);

  useEffect(() => {
    let result = [...poketmonList];

    if (selectedType !== "전체") {
      result = result.filter((p) => p.types.includes(selectedType));
    }

    if (expSort) {
      result.sort((a, b) =>
        expSort === "exp_desc"
          ? b.base_experience - a.base_experience
          : a.base_experience - b.base_experience
      );
    } else if (statSort) {
      const statKey = statSort.split("_")[0];
      const order = statSort.split("_")[1];
      result.sort((a, b) => {
        const aStat =
          a.stats.find((s) => s.stat.name === statKey)?.base_stat || 0;
        const bStat =
          b.stats.find((s) => s.stat.name === statKey)?.base_stat || 0;
        return order === "desc" ? bStat - aStat : aStat - bStat;
      });
    } else {
      switch (nameSort) {
        case "korean_asc":
          result.sort((a, b) => a.korean_name.localeCompare(b.korean_name));
          break;
        case "korean_desc":
          result.sort((a, b) => b.korean_name.localeCompare(a.korean_name));
          break;
        default:
          result.sort((a, b) => a.id - b.id);
      }
    }

    setFilteredList(result);
  }, [poketmonList, selectedType, nameSort, expSort, statSort]);

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="main_container">
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        nameSort={nameSort}
        setNameSort={setNameSort}
        expSort={expSort}
        setExpSort={setExpSort}
        statSort={statSort}
        setStatSort={setStatSort}
      />
      <div className="poketmon_grid">
        {filteredList.map((poketmon, index) => (
          <Link
            key={poketmon.id}
            to={`/detail/${poketmon.id}`}
            state={{ list: filteredList, currentIndex: index }}
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
    </div>
  );
};

export default Main;
