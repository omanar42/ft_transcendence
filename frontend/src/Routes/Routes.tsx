import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Login from "../Components/Pages/Login/Login";
import Welcome from "../Components/Pages/Welcome/Welcome";
import MainLayout from "../Layouts/MainLayout";
import ChatLayout from "../Layouts/ChatLayout";
import Chat from "../Components/Pages/Chat/Home/Chat";
import Rooms from "../Components/Pages/Chat/Rooms/Rooms";
import Settings from "../Components/Pages/Settings/Settings";
import Explore from "../Components/Pages/Chat/Rooms/Explore";
import Friends from "../Components/Friends/Friends";
import Profile from "../Components/Pages/Profile/Profile";
import { useContext } from "react";
import LoginInfo from "../Contexts/LoginContext";

const ProtectedRoutes = () => {
  const { token, isLoading } = useContext(LoginInfo);
  // const token = true;
  if (isLoading) return <div>Loading...</div>;
  console.log("is Logged is", token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
  const { token } = useContext(LoginInfo);
  return token ? <Navigate to="/home" replace /> : <Outlet />;
};
export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<LoginRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          // Chat Routes
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<Chat />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="chat" element={<Chat />} />
            <Route path="explore" element={<Explore />} />
            <Route path="friends" element={<Friends />} />
          </Route>
          // Other Routes
          <Route path="/home" element={<Home />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/friends" element={<Friends />} />
          // Profile Route
          <Route path="Profile" element={<Profile />}>
            <Route path=":username" element={<Profile />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);
