import "./Filter.scss";

const FilterBar = ({
  selectedType,
  setSelectedType,
  nameSort,
  setNameSort,
  expSort,
  setExpSort,
  statSort,
  setStatSort,
}) => {
  return (
    <div className="filter_bar">
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        {["전체", "fire", "water", "grass", "electric", "bug", "normal", "poison", "flying"].map((type) => (
          <option key={type} value={type}>
            {type === "전체" ? "전체" : type}
          </option>
        ))}
      </select>

      <select
        value={nameSort}
        onChange={(e) => {
          setNameSort(e.target.value);
          setExpSort("");
          setStatSort("");
        }}
      >
        <option value="id">번호순</option>
        <option value="korean_asc">가나다순</option>
        <option value="korean_desc">가나다 역순</option>
      </select>

      <select
        value={expSort}
        onChange={(e) => {
          setExpSort(e.target.value);
          setNameSort("id");
          setStatSort("");
        }}
      >
        <option value="">경험치 정렬</option>
        <option value="exp_desc">경험치 높은 순</option>
        <option value="exp_asc">경험치 낮은 순</option>
      </select>

      <select
        value={statSort}
        onChange={(e) => {
          setStatSort(e.target.value);
          setExpSort("");
          setNameSort("id");
        }}
      >
        <option value="">능력치 정렬</option>
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

