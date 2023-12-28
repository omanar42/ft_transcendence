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

export const routermin = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="home" element={<Home />} />
      <Route index element={<Home />} />

      <Route path="/chat" element={<ChatLayout />}>
        <Route index element={<Chat />} />
        <Route path="rooms" element={<Chaneels />} />
        <Route path="chat" element={<Chat />} />

      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/Welcom" element={<Welcome />} />
    </Route>
  )
);

// export const allRoutes = () => {
//   return <RouterProvider router={router} />;
// };
