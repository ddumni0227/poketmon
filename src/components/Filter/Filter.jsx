import React from "react";
import "./Filter.scss";

const FilterBar = ({ selectedType, setSelectedType, sortBy, setSortBy }) => {
  const typeOptions = [
    "전체",
    "fire",
    "water",
    "grass",
    "electric",
    "bug",
    "normal",
    "poison",
    "flying",
  ];

  return (
    <div className="filter_bar">
      <select
        className="filter_select"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        {typeOptions.map((type) => (
          <option key={type} value={type}>
            {type === "전체" ? "전체" : type}
          </option>
        ))}
      </select>

      <select
        className="filter_select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="id">번호순</option>
        <option value="korean_asc">가나다순</option>
        <option value="korean_desc">가나다 역순</option>
      </select>
    </div>
  );
};

export default FilterBar;
