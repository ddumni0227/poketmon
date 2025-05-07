import { Link } from "react-router-dom";
import "./PoketmonCard.scss";

const PoketmonCard = ({ poketmon, isFavorite, onToggleFavorite }) => {
  return (
    <Link
      to={`/detail/${poketmon.id}`}
      className="poketmon_card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <img src={poketmon.image} alt={poketmon.koreanName} />
      <div className="poketmon_name">
        {poketmon.korean_name}
        <button
          className="heart_btn"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(poketmon.id);
          }}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
    </Link>
  );
};

export default PoketmonCard;
