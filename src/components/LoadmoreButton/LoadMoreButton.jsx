import "./LoadMoreButton.scss";

const LoadMoreButton = ({ onClick }) => (
  <div className="load_more">
    <button onClick={onClick}>더보기 ▽</button>
  </div>
);

export default LoadMoreButton;
