import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../Components/Pages/Login";
import NavigationLink from "../Utils/NavigationLink";
import { FaBell } from "react-icons/fa6";
import ProfileAvatar from "../Utils/ProfileAvatar";
import Avatar from "../assets/avatar.jpeg";
import { useContext, useEffect, useState } from "react";
import LoginInfo from "../Contexts/LoginContext";
import { MdOutlineWarning } from "react-icons/md";


function DropDwonMenu({CloseDropMenu}:any) {
  const { Logout }: any = useContext(LoginInfo);
  return (
    <div className="transition-all duration-[0.3s] border-2 z-50 border-opacity-20 border-white absolute top-[8rem] rounded-xl pt-3 right-[-1.7rem] bg-dark w-[10rem] h-[13rem]">
      <ul className="flex flex-col items-center justify-center gap-4 font-bold text-2xl">
        <NavigationLink onClick={CloseDropMenu} to="Profile/me">Profile</NavigationLink>
        <NavigationLink onClick={CloseDropMenu} to="Settings">Settings</NavigationLink>
      
        <a onClick={Logout} className="hover:bg-pink-600 pl-4 pr-4 p-2 duration-75 hover:scale-[1.2] z-50 rounded-xl cursor-pointer" >Log Out</a>
      </ul>
    </div>
  );
}

function MainLayout() {
  const [isDropDown, setisDropDown] = useState(false);
  const { userInfo, gamesocket, setGameMode  }: any = useContext(LoginInfo);
  const CloseDropMenu = () => setisDropDown(false);
  const [isInvitation, setIsInvitation] = useState(false);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const {connected}:any = useContext(LoginInfo)


  useEffect(() => {
    if (gamesocket) {
      gamesocket.on("invitation", (data: any) => {
        setRoomId(data.roomId);
        setIsInvitation(true);
      });

      return () => {
        gamesocket.off("invitation");
      }
    }
  }, [gamesocket]);

  const handleAccept = () => {    
    const dataToSend = {
      roomId: roomId,
      status: 'accept'
    };
    gamesocket?.emit("PlayWithFriend", dataToSend);
    setIsInvitation(false);
    setGameMode('friend');
    navigate('/game');
  };

  const handleReject = () => {
    const dataToSend = {
      roomId: roomId,
      status: 'reject'
    };
    gamesocket?.emit("PlayWithFriend", dataToSend);
    setIsInvitation(false);
  }

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
              <NavigationLink to="/friends" onClick={CloseDropMenu}>
                Friends
              </NavigationLink>
            </ul>
          </nav>

        </div>
        <div className="relative">
        <ProfileAvatar
            src={userInfo.avatar}
            className="h-[6rem] w-[6rem] cursor-pointer border-4  rounded-full hover:scale-[1.2] duration-100 border-pink-100 hover:border-4"
            onClick={() => setisDropDown(!isDropDown)}
          />
          {isDropDown && <DropDwonMenu  CloseDropMenu={CloseDropMenu}/>}

        </div>
      </div>
      <main>
      {!connected ? <div className="modal h-screen flex justify-center items-center">
            <div className="w-[50%] h-[20%] bg-dark-300 rounded-3xl flex flex-col justify-around items-center">
              <h1 className="text-8xl text-pink-600">You lost Connection</h1>
              <div className="flex items-center gap-[1rem]">
              <MdOutlineWarning  className="text-7xl text-yellow-400"/>
              <h2 className="text-2xl wrap"><strong>CyberPonk</strong>k is open in another window. Click <strong className="text-4xl text-pink-600">Use Here</strong> to use <strong>CyberPonk</strong>  in this window</h2>
              </div>
              <button className="text-5xl uppercase p-4 bg-pink-600 rounded-3xl hover:opacity-60 hover:duration-[0.2s]" onClick={()=>window.location.reload()}>Use Here</button>
            </div>
          </div>
          :
            <Outlet />
            }
      </main>
      {isInvitation && (
        <div className="fixed top-0 z-50 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-dark p-10 rounded-xl">
            <h1 className="text-4xl font-bold text-white">
              You have an invitation
            </h1>
            <div className="flex justify-between items-center gap-10 mt-10">
              <button
                className="bg-pink-600 pl-4 pr-4 p-2 duration-75 hover:scale-[1.2] z-50 rounded-xl"
                onClick={() => handleAccept()}
              >
                Accept
              </button>
              <button
                className="bg-pink-600 pl-4 pr-4 p-2 duration-75 hover:scale-[1.2] z-50 rounded-xl"
                onClick={() => handleReject()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
