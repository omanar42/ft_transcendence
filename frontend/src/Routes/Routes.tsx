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

const ProtectedRoutes = () => {
  // const {token}= useContext(LoginInfo)
  const token = true;
  console.log("is Logged is", token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />

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
          <Route path="Profile" element={<Profile />}>
            <Route path=":username" element={<Profile />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);
