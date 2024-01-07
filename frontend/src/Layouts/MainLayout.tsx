import { Link, Outlet } from "react-router-dom";
import { Logo } from "../Components/Pages/Login";
import NavigationLink from "../Utils/NavigationLink";
import { FaBell } from "react-icons/fa6";
import ProfileAvatar from "../Utils/ProfileAvatar";
import Avatar from "../assets/avatar.jpeg";
import { useContext, useState } from "react";
import LoginInfo from "../Contexts/LoginContext";

function DropDwonMenu() {
  return (
    <div className="transition-all duration-[0.3s] absolute top-[8rem] rounded-xl pt-3 right-[-1.7rem] bg-dark w-[10rem] h-[13rem]">
      <ul className="flex flex-col items-center justify-center gap-4 font-bold text-2xl">
        <NavigationLink to="Profile/me">Profile</NavigationLink>
        <NavigationLink to="Settings">Settings</NavigationLink>
        <NavigationLink to="logout">Logout</NavigationLink>
      </ul>
    </div>
  );
}

function MainLayout() {
  const [isDropDown, setisDropDown] = useState(false);
  const {userInfo}:any = useContext(LoginInfo);
  const CloseDropMenu = () => setisDropDown(false);
  return (
    <div>
      <div className="max-w-140  ml-auto mr-auto p-10 text-3xl text-white h-40 flex justify-between items-center font-extrabold">
        <Link to="/">
          <img className="h-10 cursor-pointer" src={Logo} />
        </Link>

        <div className="flex items-center gap-[8rem] relative">
          <nav>
            <ul className="flex gap-40">
              <NavigationLink to="/home" onClick={CloseDropMenu}>
                Home
              </NavigationLink>
              <NavigationLink to="/game" onClick={CloseDropMenu}>
                Game
              </NavigationLink>
              <NavigationLink to="/chat" onClick={CloseDropMenu}>
                Chat
              </NavigationLink>
              <NavigationLink to="/settings" onClick={CloseDropMenu}>
                Settings
              </NavigationLink>
            </ul>
          </nav>
          <FaBell className="text-4xl" />
          <ProfileAvatar
            src={userInfo.avatar}
            className="h-[6rem] w-[6rem] cursor-pointer rounded-full hover:scale-[1.2] duration-100 border-pink-100 hover:border-4"
            onClick={()=>setisDropDown(!isDropDown)}
          />
          {isDropDown && <DropDwonMenu />}
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
