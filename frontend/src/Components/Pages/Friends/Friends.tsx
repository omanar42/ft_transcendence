import { useEffect, useState } from "react";

import axios from "axios";
import { HiUserRemove } from "react-icons/hi";
import { ImBlocked } from "react-icons/im";
import { IoPersonAddSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";


export const friendAction = async (
  frUser: any,
  action: any,
  handlUpdate: any,
  id: any
) => {
  const actions = {
    remove: "remove",
    accept: "accept",
    block: "block",
    unblock: "unblock",
    revoke: "revoke",
  };

  try {
    const url = `http://127.0.0.1:3000/users/${actions[action]}`;
    const res = await axios.post(
      url,
      { friendUser: frUser },
      { withCredentials: true }
    );
    toast.success(res.data.message);
    handlUpdate(id);
  } catch (e) {
    toast.success(e.response.data.message);
  }
};

function ListFriends({ avatar, username, handlUpdate, id, actions }: any) {
  const navigate = useNavigate();
  return (
    <li 
    className="text-white flex cursor-pointer  hover:scale-[1.2] hover:duration-[0.2s] flex-col justify-between w-[20rem] h-[25rem] border-4 border-white border-opacity-20 rounded-xl">
      <img onClick={()=>navigate(`/profile/${username}`)} className="h-[2rem] hover:opacity-65 w-full flex-1" src={avatar} />
      <div className="flex h-[6rem] justify-around items-center  gap-[1rem]">
        <h1 className="text-3xl overflow-hidden whitespace-nowrap text-ellipsis  ml-1 w-[11rem] h-[4rem] p-2 text-center rounded-xl border-opacity-25 font-bold">
          {username}
        </h1>
        {actions.find((action)=> action === "ACCEPT") && (
          <button
            onClick={() => friendAction(username, "accept", handlUpdate, id)}
            className="text-2xl cursor-pointer rounded-lg p-2 border-2 border-white border-opacity-20 mr-1 font-bold hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            Accept
          </button>
        )}
        {(actions.find((action)=> action === "REMOVE") && actions.find((action)=> action === "BLOCK"))&& (
          <div className="flex items-center gap-[1rem]">
            <HiUserRemove
              onClick={() => friendAction(username, "remove", handlUpdate, id)}
              className="text-5xl text-green cursor-pointer rounded-full hover:bg-pink-600 hover:bg-opacity-40 hover:duration-[0.2s]"
            />
            <ImBlocked
              onClick={() => friendAction(username, "block", handlUpdate, id)}
              className="text-4xl text-red-600 cursor-pointer hover:bg-white rounded-full hover:bg-opacity-20 hover:duration-[0.2s]"
            />
          </div>
        )}
        {actions.find((action)=> action === "UNBLOCK") && (
          <button
            onClick={() => friendAction(username, "unblock", handlUpdate, id)}
            className="text-2xl cursor-pointer border-2 border-white border-opacity-20 rounded-lg p-2 font-bold hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            Unblock
          </button>
        )}
        {actions.find((action)=> action === "REVOKE") && (
          <button
            onClick={() => friendAction(username, "revoke", handlUpdate, id)}
            className="text-2xl cursor-pointer border-2 border-white border-opacity-20 rounded-lg p-2 font-bold hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            REVOKE
          </button>
        )}
      </div>
    </li>
  );
}
function Friends() {
  const [Friends, setFriends] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [addFriend, setAddFriend] = useState("");
  const [ setActions] = useState("");

  useEffect(() => {
    getFriendsAction("friends");
  }, []);
  const handlUpdate = (id: any) => {
    setFriends(Friends.filter((friend) => friend.id !== id));
  };
  const getFriendsAction = async (action: any) => {
    const actions = {
      friends: "friends",
      blocked: "blocked",
      requests: "requests",
      invitations: "invitations",
    };
    try {
      const url = `http://127.0.0.1:3000/users/${actions[action]}`;
      const res = await axios.get(url, { withCredentials: true });
      setFriends(res.data);
      setActions(res.data.actions);
    } catch (e) {
    }
  };

  const AddFriend = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:3000/users/add",
        { friendUser: addFriend },
        { withCredentials: true }
      );
        toast.success("Friend request sent");



      setIsOpened(false);
      setAddFriend("");
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <motion.div 
    initial={{ width: 0 }}
    animate={{ width: "140rem" }}
    exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
    className="ml-auto mr-auto w-[140rem] h-[62rem] rounded-xl bg-black bg-opacity-20 backdrop-blur-sm p-[3rem] border-2 border-white border-opacity-20">
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
      <motion.div 
         initial={{ width: 0 }}
         animate={{ width: "100%" }}
         exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
      className=" flex flex-col border-opacity-20">
        <header className="h-[7rem] bg-dark-300 bg-opacity-60 rounded-xl text-white flex items-center justify-around">
          <nav className="flex justify-between  w-2/3 text-2xl pr-[3rem] font-bold pl-[3rem]">
            <button
              onClick={() => getFriendsAction("friends")}
              className="hover:bg-pink-600 p-4 rounded-2xl hover:duration-[0.2s]"
            >
              Friends
            </button>
            <button
              onClick={() => getFriendsAction("blocked")}
              className="hover:bg-pink-600 p-4 rounded-2xl hover:duration-[0.2s]"
            >
              Blocked
            </button>
            <button
              onClick={() => getFriendsAction("requests")}
              className="hover:bg-pink-600 p-4 rounded-2xl hover:duration-[0.2s]"
            >
              Requests
            </button>
            <button
              onClick={() => getFriendsAction("invitations")}
              className="hover:bg-pink-600 p-4 rounded-2xl hover:duration-[0.2s]"
            >
              Invitations
            </button>
          </nav>
          <div className="flex flex-col items-center">
            <IoPersonAddSharp
              onClick={() => setIsOpened(!isOpened)}
              className="text-4xl relative cursor-pointer"
            />
            {isOpened && (
              <div className="absolute top-[12rem] flex items-center justify-center gap-4">
                <input
                  onChange={(e) => setAddFriend(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && AddFriend()}
                  
                  value={addFriend}
                  className=" text-2xl w-[20rem] outline-none pl-4 h-[3rem] bg-dark-200 rounded-xl border-2 border-white border-opacity-20"
                />
                <button
                  onClick={AddFriend}
                  className="text-3xl border-2 border-white border-opacity-20 p-2 rounded-2xl font-bold bg-green-600 hover:bg-opacity-80 hover:duration-[0.2s] "
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </header>
        <ul className="mt-[5rem] flex flex-wrap gap-[3rem]">
          {Friends.map((Friend, index) => (
            <ListFriends
              avatar={Friend.frAvatar}
              username={Friend.frUser}
              status={Friend.status}
              id={Friend.id}
              handlUpdate={handlUpdate}
              actions={Friend.actions}
              key={index}
            />
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default Friends;
