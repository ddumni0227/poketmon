import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Main from "./page/main/Main";
import Detail from "./page/Detail/Detail";
import Search from "./page/Search/Search";
import { FavoriteProvider } from "./context/FavoriteContext";
import Favorite from "./page/Favorite/Favorite";

const App = () => {
  return (
    <FavoriteProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </FavoriteProvider>
  );
};

export default App;
