import { useContext, useEffect, useState, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import { RoomContext } from "../../../../Contexts/RoomContext";
import LoginInfo from "../../../../Contexts/LoginContext";
import { IoLogOutSharp } from "react-icons/io5";
import "../Rooms/CreateRoom.css";
import { ToastContainer, toast } from "react-toastify";
import { IoMdPersonAdd } from "react-icons/io";
import Avatar from "../assets/avatar.png";


interface messageData {
  message: string;
  roomId: number;
  userName: string;
}

const useAutoScroll = () => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return bottomRef;
};

function MessageInput({setChannelsList}:any) {
  const [currentMessage, setcurrentMessage] = useState("");
  const { currentRoom, setCurrentRoom }: any = useContext(RoomContext);
  const { userInfo, socket }: any = useContext(LoginInfo);
  const [isOpen, setIsOpen] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [inviteFriend, setFriend] = useState("");
  const [addIsopen, setAddIsOpen] = useState(false);
  const [newOwner, setNewowner] = useState("");
  const { ownerSheep, setMessageList, messageList, setAvatar, avatar, setRoomName, roomName, status}:any = useContext(RoomContext);
  const scrollRef = useAutoScroll();
  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData: messageData = {
        message: currentMessage,
        roomId: currentRoom,
        userName: userInfo.username,
      };
      setMessageList((list:any) => [...list, messageData]);
      setcurrentMessage("");
      socket.emit("message", messageData);
      // console.log(messageData);
    }
  };

  const leaveRoom = async () => {
    if (ownerSheep === "OWNER" && newOwner === "") {
      toast.error("New owner should not be empty");
      return;
    }
    setIsOpen(false);
    setCurrentRoom(0);
    setNewowner("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/chat/leaveroom",
        { roomId: currentRoom, newOwner: newOwner },
        { withCredentials: true }
      );
        toast.success("You left the room");
      
    setChannelsList(response.data);
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    socket?.off("new_message").on("new_message", (data: any) => {
      if (data.roomId === currentRoom)
        setMessageList((list:any) => [...list, data]);
    });
  }, [socket, currentRoom]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await axios.get(`http://127.0.0.1:3000/chat/Messages`, {
        params: {
          roomId: currentRoom,
        },
        withCredentials: true,
      }).catch((error) => { toast.warning(error.response.data.message); return;});
      setMessageList(messages.data.messages);
      setRoomName(messages.data.roomName);
      setRoomType(messages.data.roomType);
      setAvatar(messages.data.Avatar);
      if(!messages.data.Avatar)
        setAvatar(Avatar);
    };
    if (currentRoom) {
      fetchMessages();
    }
  }, [currentRoom]);

  const inviteUser = async () => {
    if (inviteFriend === "") {
      toast.error("Username should not be empty");
      return;
    }
    await axios.post("http://127.0.0.1:3000/chat/add_user", {roomId: currentRoom, username:inviteFriend},
     {withCredentials: true}).then((res)=>setChannelsList(res.data)).catch((error) => { toast.warning(error.response.data.message); return;});
    setAddIsOpen(false);
    setFriend("");
    setCurrentRoom(0);
    toast.success("User added");
  };
  return (
    <div className="border-2 border-white rounded-2xl border-opacity-20 col-span-3 flex flex-col justify-between overflow-hidden">
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
        className="text-4xl"
      />
      {currentRoom ? (
        <>
          <div className=" bg-dark  chat-header flex items-center justify-between pl-[5rem] pr-[5rem] h-[8rem]">
            <img
              className="h-[6rem] w-[6rem] bg-white rounded-full"
              src={avatar}
              alt="avatar"
            />
            <p className="text-3xl font-bold tracking-3">{roomName}</p>
            {roomType !== "DIRECT_MESSAGE" && (
              <IoLogOutSharp
                onClick={() => setIsOpen(true)}
                className="text-5xl cursor-pointer"
              />
            )}
            {roomType === "PRIVATE" && (
              <div className="relative">
                <IoMdPersonAdd onClick={()=>setAddIsOpen(!addIsopen)} className="text-5xl cursor-pointer " />
                {addIsopen && <div className="absolute top-[6rem]  right-[-5rem] flex gap-2 items-center">
                  <input
                    onChange={(e) => setFriend(e.target.value)}
                    value={inviteFriend}
                    className=" text-2xl w-[20rem]  outline-none pl-4 h-[3rem] bg-dark-200 rounded-xl border-2 border-white border-opacity-20"
                  />
                  <button
                    onClick={inviteUser}
                    className="text-3xl border-2 border-white border-opacity-20 p-2 rounded-2xl font-bold bg-green-600 hover:bg-opacity-80 hover:duration-[0.2s] "
                  >
                    Add
                  </button>
                </div>}
              </div>
            )}
            {isOpen && (
              <div className="modal flex items-center justify-center text-black ">
                <div className="w-[80rem] bg-white h-[20rem] bg-opacity-80 flex flex-col justify-around items-center rounded-2xl">
                  <h1 className="uppercase text-5xl font-extrabold">
                    Are you sure you want to leave?
                  </h1>
                  {ownerSheep === "OWNER" && (
                    <div className="flex w-full items-center justify-around">
                      <h1 className="text-3xl font-bold">New Owner</h1>
                      <input
                        className="h-[3rem] rounded-2xl bg-black text-white text-2xl font-bold pl-4 border-2 border-white border-opacity-20 outline-none"
                        onChange={(e) => setNewowner(e.target.value)}
                        value={newOwner}
                      />
                    </div>
                  )}
                  <div className="text-5xl font-bold flex gap-[5rem] text-white">
                    <button
                      onClick={leaveRoom}
                      className="bg-pink-600 p-3 rounded-2xl hover:bg-white hover:text-black  hover:duration-[0.2s]"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className=" border-2 border-black p-3 rounded-2xl text-black hover:bg-slate-600 hover:text-white hover:duration-[0.2s] "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className=" flex-1 pl-[3rem] pr-[3rem] pt-[2rem] flex flex-col items-start overflow-y-scroll">
            {messageList.map((message:any, i:number) => {
              return (
                <div
                  className={`text-white text-2xl flex flex-col gap-[0.5rem] ${
                    userInfo.username === message.userName ? "" : "self-end"
                  } `}
                  key={i}
                >
                  <div
                    className={`p-[1rem] rounded-lg f ${
                      userInfo.username === message.userName
                        ? "bg-blue-600"
                        : "bg-pink-600"
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                  <p
                    className={`text-[1rem]  ${
                      userInfo.username === message.userName
                        ? "self-end"
                        : "self-start"
                    } font-bold`}
                  >
                    {message.userName}
                  </p>
                  <div className="text-lg">
                    <p>{}</p>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef}/>
          </div>
          {ownerSheep !== "BANNED" && !status ? (
            <div className="h-[6rem] pl-10 pr-10 border-t-2 border-opacity-20 border-white flex justify-between items-center gap-3">
              <input
                className="h-14 flex-1 outline-none rounded-3xl pl-10 text-white bg-black bg-opacity-50 text-2xl"
                type="text"
                placeholder="Write message"
                onChange={(event) => setcurrentMessage(event.target.value)}
                value={currentMessage}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <IoIosSend
                onClick={sendMessage}
                className="text-6xl text-pink-600 cursor-pointer"
              />
            </div>
           
          ): <div className="flex justify-center">
          {status === true ?<h1 className="text-5xl">You are Muted</h1>: <h1 className="text-5xl">You are Banned</h1>}
        </div>}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default MessageInput;
