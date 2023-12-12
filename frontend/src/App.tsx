import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Login from "./Components/Pages/Login/Login";
import NavBar from "./Components/NavBar";
import Welcome from "./Components/Pages/Welcome/Welcome";


function Test(){
  return(<div className="h-40 p-20 bg-dark text-white font-bold text-3xl flex justify-between items-center">
      <Link to="/login" >Log in</Link>
      <Link to="/welcom" >Create profile</Link>
      <Link to="/test" >Log in</Link>
  </div>)
}

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Test />} />

        <Route path="/login" element={<Login />} />
        <Route path="/Welcom" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
