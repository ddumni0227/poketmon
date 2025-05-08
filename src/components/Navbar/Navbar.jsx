import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const nav = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    localStorage.setItem("searchKeyword", searchTerm.trim());
    nav(`/search?keyword=${searchTerm.trim()}`);
    setSearchTerm("");
  };

  return (
    <nav className="navbar">
      <div className="redline">
        {" "}
        <button className="darkmode_btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ 라이트모드" : "🌙 다크모드"}
        </button>
      </div>
      <h1 className="logo">포켓몬 도감</h1>

      <div className="menu">
        <div className="nav">
          <Link to="/">메인</Link>
          <Link to="/favorites">찜목록</Link>
        </div>

        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="포켓몬 이름 검색하기"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
