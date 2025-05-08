import Navbar from "./components/Navbar/Navbar";
import Main from "./page/main/Main";
import Detail from "./page/Detail/Detail";
import Search from "./page/Search/Search";
import { FavoriteProvider } from "./context/FavoriteContext";
import Favorite from "./page/Favorite/Favorite";
import { Routes, Route } from "react-router-dom"; // BrowserRouter 제거!

const App = () => {
  return (
    <FavoriteProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/detail/:id"
          element={<Detail isFavoriteRoute={false} />}
        />
        <Route
          path="/favorite/detail/:id"
          element={<Detail isFavoriteRoute={true} />}
        />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </FavoriteProvider>
  );
};

export default App;
