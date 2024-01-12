import { useEffect, useState } from "react";

import axios from "axios";
import { HiUserRemove } from "react-icons/hi";
import { ImBlocked } from "react-icons/im";
import { IoPersonAddSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

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
  };

  try {
    const url = `http://127.0.0.1:3000/users/${actions[action]}`;
    const res = await axios.post(
      url,
      { friendUser: frUser },
      { withCredentials: true }
    );
    if (res.data === "Friend accepted") toast.success("Friend accepted");
    else if (res.data === "Friend removed") toast.success("Friend removed");
    else if (res.data === "Friend blocked") toast.success("Friend blocked");
    else if (res.data === "Friend unblocked") toast.success("Friend unblocked");

    handlUpdate(id);
  } catch (e) {
    console.error(e);
  }
};

function ListFriends({ avatar, username, status, handlUpdate, id }: any) {
  return (
    <li className="text-white flex cursor-pointer hover:scale-[1.2] hover:duration-[0.2s] flex-col justify-between w-[20rem] h-[25rem] border-4 border-white border-opacity-20 rounded-xl">
      <img className="h-[2rem] w-full flex-1" src={avatar} />
      <div className="flex h-[6rem] justify-around items-center gap-[1rem]">
        <h1 className="text-3xl border-2 overflow-hidden whitespace-nowrap text-ellipsis border-white ml-1 w-[11rem] h-[4rem] p-2 text-center rounded-xl border-opacity-25 font-bold">
          {username}
        </h1>
        {status === "PENDING" && (
          <button
            onClick={() => friendAction(username, "accept", handlUpdate, id)}
            className="text-2xl cursor-pointer rounded-lg p-2 border-2 border-white border-opacity-20 mr-1 font-bold hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            Accept
          </button>
        )}
        {status === "FRIENDS" && (
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
        {status === "BLOCKED" && (
          <button
            onClick={() => friendAction(username, "unblock", handlUpdate, id)}
            className="text-2xl cursor-pointer border-2 border-white border-opacity-20 rounded-lg p-2 font-bold hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            Unblock
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
    } catch (e) {
      console.error(e);
    }
  };

  const AddFriend = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/users/add",
        { friendUser: addFriend },
        { withCredentials: true }
      );
      if (res.data === "Friend request sent")
        toast.success("Friend request sent");
      else if (res.data === "Already friends")
        toast.warn("Already friends");
      else toast.error("User not found");

      setIsOpened(false);
      setAddFriend("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="ml-auto mr-auto w-[140rem] h-[62rem] rounded-xl bg-black bg-opacity-20 backdrop-blur-sm p-[3rem] border-2 border-white border-opacity-20">
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
      <div className=" flex flex-col border-opacity-20">
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
          {Friends.map((Friend) => (
            <ListFriends
              avatar={Friend.frAvatar}
              username={Friend.frUser}
              status={Friend.status}
              id={Friend.id}
              handlUpdate={handlUpdate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Friends;
