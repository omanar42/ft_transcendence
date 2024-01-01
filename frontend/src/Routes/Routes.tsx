import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "../Components/Pages/Home/Home";
import Login from "../Components/Pages/Login/Login";
import Welcome from "../Components/Pages/Welcome/Welcome";
import MainLayout from "../Layouts/MainLayout";
import ChatLayout from "../Layouts/ChatLayout";
import Chaneels from "../Components/Pages/Chat/Chaneels/Chaneels";
import Chat from "../Components/Pages/Chat/Home/Chat";
import Settings from "../Components/Pages/Settings/Settings";
import Profile from "../Components/Pages/Profile/profile";
import Friends from "../Components/Pages/Friends/friends";

export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/chat" element={<ChatLayout />}>
        <Route index element={<Chat />} />
        <Route path="rooms" element={<Chaneels />} />
        <Route path="chat" element={<Chat />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/Welcom" element={<Welcome />} />
      <Route path="/Settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<Friends />} />
    </Route>
  )
);

// export const allRoutes = () => {
//   return <RouterProvider router={router} />;
// };
