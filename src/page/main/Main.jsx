import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.scss";
import { useFavorite } from "../../context/FavoriteContext";
import PoketmonCard from "../../components/PoketmonCard/PoketmonCard";
import { Link } from "react-router-dom";
import FilterBar from "../../components/Filter/Filter";
import LoadMoreButton from "../../components/LoadmoreButton/LoadMoreButton";

const Main = () => {
  const [poketmonList, setPoketmonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("전체");
  const [nameSort, setNameSort] = useState("id");
  const [sortOption, setSortOption] = useState("");

  const [visibleCount, setVisibleCount] = useState(30); // 초기에는 30개 표시

  const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchPoketmons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=300");
        const { results } = response.data;

        const data = await Promise.all(
          results.map(async (poketmon) => {
            const detailRes = await axios.get(poketmon.url);
            const speciesRes = await axios.get(
              `https://pokeapi.co/api/v2/pokemon-species/${detailRes.data.id}`
            );
            const koreanName =
              speciesRes.data.names.find((name) => name.language.name === "ko")?.name ||
              detailRes.data.name;

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

    // 타입 필터링
    if (selectedType !== "전체") {
      result = result.filter((p) => p.types.includes(selectedType));
    }

    // 정렬
    if (sortOption) {
      if (sortOption.startsWith("exp")) {
        result.sort((a, b) =>
          sortOption === "exp_desc"
            ? b.base_experience - a.base_experience
            : a.base_experience - b.base_experience
        );
      } else {
        const [statKey, order] = sortOption.split("_");
        result.sort((a, b) => {
          const aStat = a.stats.find((s) => s.stat.name === statKey)?.base_stat || 0;
          const bStat = b.stats.find((s) => s.stat.name === statKey)?.base_stat || 0;
          return order === "desc" ? bStat - aStat : aStat - bStat;
        });
      }
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
  }, [poketmonList, selectedType, nameSort, sortOption]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 30, 300));
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="main_container">
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        nameSort={nameSort}
        setNameSort={setNameSort}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <div className="poketmon_grid">
        {filteredList.slice(0, visibleCount).map((poketmon, index) => (
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
      {visibleCount < filteredList.length && (
        <LoadMoreButton onClick={handleLoadMore} />
      )}
    </div>
  );
};

export default Main;
