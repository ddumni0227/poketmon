// src/pages/Main/Main.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.scss";
import { useFavorite } from "../../context/FavoriteContext";
import PoketmonCard from "../../components/PoketmonCard/PoketmonCard";
import LoadMoreButton from "../../components/LoadmoreButton/LoadMoreButton";
import FilterBar from "../../components/Filter/Filter";

const Main = () => {
  const [poketmonList, setPoketmonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [displayCount, setDisplayCount] = useState(42);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("전체");
  const [sortBy, setSortBy] = useState("id");

  const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchPoketmons = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=280"
        );
        const { results } = response.data;

        const data = [];

        for (const poketmon of results) {
          const detailRes = await axios.get(poketmon.url);
          const speciesRes = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${detailRes.data.id}`
          );
          const koreanName =
            speciesRes.data.names.find((name) => name.language.name === "ko")
              ?.name || detailRes.data.name;

          data.push({
            id: detailRes.data.id,
            name: detailRes.data.name,
            korean_name: koreanName,
            image: detailRes.data.sprites.front_default,
            types: detailRes.data.types.map((t) => t.type.name),
          });
        }

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

    if (sortBy === "korean_asc") {
      result.sort((a, b) => a.korean_name.localeCompare(b.korean_name));
    } else if (sortBy === "korean_desc") {
      result.sort((a, b) => b.korean_name.localeCompare(a.korean_name));
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    setFilteredList(result);
  }, [poketmonList, selectedType, sortBy]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 42, filteredList.length));
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="main_container">
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="poketmon_grid">
        {filteredList.slice(0, displayCount).map((poketmon) => (
          <PoketmonCard
            key={poketmon.id}
            poketmon={poketmon}
            isFavorite={favorites.includes(poketmon.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {displayCount < filteredList.length && (
        <LoadMoreButton onClick={handleLoadMore} />
      )}
    </div>
  );
};

export default Main;
