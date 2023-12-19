import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Login from "./Components/Pages/Login/Login";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Pages/Welcome/Welcome";
import Chat from "./Components/Pages/Chat/Chat";
import Home from "./Components/Pages/Home/Home";
import Settings from "./Components/Pages/Settings/Settings";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Welcom" element={<Welcome />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
