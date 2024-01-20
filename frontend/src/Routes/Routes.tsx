import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  Navigate,
  Outlet,
  useLocation,
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
import Friends from "../Components/Pages/Friends/Friends";
import LadingPage from "../Components/Pages/Game/Game";
import Profile from "../Components/Pages/Profile/Profile";
import { useContext } from "react";
import LoginInfo from "../Contexts/LoginContext";
import TwoFaVerfication from "../Components/Pages/2Fa/TwoFaVerfication";
import NotFound from "../Components/Pages/404/NotFound";
import GameAI from "../Components/Pages/Game/GameAI";
import AboutUs from "../Components/Pages/AboutUs/AboutUs";

const ProtectedRoutes = () => {
  const { token, isLoading }: any = useContext(LoginInfo);

  if (isLoading) return <div>Loading...</div>;
  return token ? <Outlet  /> : <Navigate to="/login" replace />;
};

const ProtectLogin = () => {
  const { token, isLoading }: any = useContext(LoginInfo);

  if (isLoading) return <div>Loading...</div>;

  return !token ? <Outlet /> : <Navigate to="/home" replace />;
};

const Protect2fa = () => {
  const { verifed, userInfo }: any = useContext(LoginInfo);
  if (userInfo.twoFactor && !verifed) {
    return <Navigate to="/two-factor" replace />;
  }
  return <Outlet />;
};

const Reverse2fa = () => {
  const { verifed }: any = useContext(LoginInfo);

  return !verifed ? <Outlet /> : <Navigate to="/home" replace />;
};


export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<Reverse2fa />}>
        <Route path="/two-factor" element={<TwoFaVerfication />} />
      </Route>
      <Route element={<ProtectLogin />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route element={<Protect2fa />}>
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/game" element={<LadingPage />} />
        <Route path="/game/ai" element={<GameAI />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            // Chat Routes
            <Route  path="/chat" element={<ChatLayout />}>
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
          toR</Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Route>
  )
);
