import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Login from "../Components/Pages/Login/Login";
import Welcome from "../Components/Pages/Welcome/Welcome";
import MainLayout from "../Layouts/MainLayout";
import ChatLayout from "../Layouts/ChatLayout";
import Chat from "../Components/Pages/Chat/Home/Chat";
import Rooms from "../Components/Pages/Chat/Rooms/Rooms";
import { useContext } from "react";
import LoginInfo from "../Contexts/LoginContext";
import Settings from "../Components/Pages/Settings/Settings";
import Explore from "../Components/Pages/Chat/Rooms/Explore";
import Friends from "../Components/Friends/Friends";


const ProtectLoginRoute = ()=>{
  const isLogged = useContext(LoginInfo);
  if (isLogged)
    <Navigate to="/home" replace/>

  return (<Login />);
}

export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route>

    <Route path="/login" element={<Login />} />
    <Route path="/" element={<MainLayout />}>
      <Route path="home" element={<Home />} />
      {/* <Route index element={<Home />} /> */}

      <Route path="/chat" element={<ChatLayout />}>
        <Route index element={<Chat />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="chat" element={<Chat />} />
        <Route path="explore" element={<Explore />} />
        <Route path="friends" element={<Friends />} />

      </Route>
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/friends" element={<Friends />} />
    </Route>
    </Route>
  )
);
