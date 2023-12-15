import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Chat from "./Pages/Chat/Index";
import { Logo } from "./Pages/Login";
import Welcome from "./Pages/Welcome/Welcome";

function NavBar() {
  return (
    <div>
      <div className="max-w-140 fix   ml-auto mr-auto p-10 text-3xl text-white h-40 flex justify-between items-center">
        <img className="h-10" src={Logo} />

        <nav>
          <ul className="flex gap-40">
            <li>
              <Link to="/login">Log in </Link>
            </li>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
