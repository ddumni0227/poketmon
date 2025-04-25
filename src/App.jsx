import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Main from "./page/main/Main";
import Detail from "./page/Detail/Detail";
import { FavoriteProvider } from "./context/FavoriteContext";

const App = () => {
  return (
    <FavoriteProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </Router>
    </FavoriteProvider>
  );
};

export default App;
