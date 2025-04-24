import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const nav = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    nav(`/search?name=${searchTerm.toLowerCase()}`);
    setSearchTerm("");
  };

  return (
    <nav className="navbar">
      <div className="redline"></div>
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
          ></input>
          <button type="submit">🔍</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
