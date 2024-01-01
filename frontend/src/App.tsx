import { BrowserRouter as Router, Route, Routes, Link, RouterProvider } from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";

function App() {
  return (
    <RouterProvider router={routermin} />
  );
}

export default App;
