import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Login from "./Components/Pages/Login/Login";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Pages/Welcome/Welcome";
import Home from "./Components/Pages/Home/Home";
import Index from "./Components/Pages/Chat/Index";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Index />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Welcom" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
