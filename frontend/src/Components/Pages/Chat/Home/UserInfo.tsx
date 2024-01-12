import Avatar from "../assets/avatar.jpeg";
import { MdOutlineBlock } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { useContext } from "react";
import { RoomContext } from "../../../../Contexts/RoomContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function UserInfo() {
  const { avatar, roomName, currentRoom }: any = useContext(RoomContext);
  const navigate = useNavigate();
  const SeeProfile = () => {
    navigate(`/profile/${roomName}`);
  };

  const blockUser = async (userName: string) => {
    try {
      const url = `http://127.0.0.1:3000/users/block`;
      const res = await axios.post(
        url,
        { friendUser: userName },
        { withCredentials: true }
      );
      if (res.data === "Friend blocked") {
        window.location.reload();
        toast.success("Friend blocked");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {currentRoom ? (
        <div className="col-span-1 flex flex-col gap-10 items-center justify-center border-2 border-white border-opacity-20 rounded-2xl">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="text-3xl"
          />
          <img
            onClick={SeeProfile}
            className="animate-bounce hover:duration-[0.2s] hover:scale-[1.1] rounded-full h-[15rem] border-4 border-pink-600 cursor-pointer"
            src={avatar}
          />
          <h1 className=" uppercase text-3xl font-bold">{roomName}</h1>
          <div
            onClick={SeeProfile}
            className="flex items-center gap-5 cursor-pointer p-4 rounded-2xl hover:duration-[0.2s] hover:bg-pink-600"
          >
            <FaShare className="text-4xl"></FaShare>
            <span className="text-xl font-semibold">See Profile</span>
          </div>
          <div onClick={()=>blockUser(roomName)} className="flex cursor-pointer items-center hover:text-white gap-5 p-4 rounded-2xl hover:duration-[0.2s] hover:bg-pink-600">
            <MdOutlineBlock className="text-5xl text-"></MdOutlineBlock>
            <span  className="text-xl font-semibold">Block</span>
          </div>
        </div>
        
      ):
      <div className="flex flex-col items-center gap-[2rem] justify-center">
        <h1 className="font-bold text-4xl animate-bounce">START</h1>
        <h1 className="font-bold text-4xl animate-bounce">A</h1>
        <h1 className="font-bold text-4xl animate-bounce">CONVERSATION</h1>
        <h1 className="font-bold text-4xl animate-bounce">FIRST</h1>
        </div>}
    </>
  );
}

export default UserInfo;
