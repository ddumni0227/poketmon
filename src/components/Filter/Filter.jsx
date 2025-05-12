import React from "react";
import "./Filter.scss";

const FilterBar = ({
  selectedType,
  setSelectedType,
  nameSort,
  setNameSort,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="filter_bar">
      {/* 타입 필터 */}
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        {["전체", "fire", "water", "grass", "electric", "bug", "normal", "poison", "flying"].map((type) => (
          <option key={type} value={type}>
            {type === "전체" ? "전체" : type}
          </option>
        ))}
      </select>

      {/* 이름(가나다) 정렬 */}
      <select value={nameSort} onChange={(e) => setNameSort(e.target.value)}>
        <option value="id">번호순</option>
        <option value="korean_asc">가나다순</option>
        <option value="korean_desc">가나다 역순</option>
      </select>

      {/* 경험치/능력치 통합 정렬 */}
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="">경험치/능력치</option>
        <option value="exp_desc">경험치 높은 순</option>
        <option value="exp_asc">경험치 낮은 순</option>
        <option value="hp_desc">HP 높은 순</option>
        <option value="hp_asc">HP 낮은 순</option>
        <option value="attack_desc">공격력 높은 순</option>
        <option value="attack_asc">공격력 낮은 순</option>
        <option value="defense_desc">방어력 높은 순</option>
        <option value="defense_asc">방어력 낮은 순</option>
      </select>
    </div>
  );
};

export default FilterBar;


