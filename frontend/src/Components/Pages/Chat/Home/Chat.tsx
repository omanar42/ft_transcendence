import ChatList from "./ChatList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import { Room } from "../Rooms/RoomList";
import axios from "axios";
import { RoomContextProvider } from "../../../../Contexts/RoomContext";

function Chat() {
  const [usersRoom, setUsersRoom] = useState<Room[]>([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/chat/dms", {
          withCredentials: true,
        });
        setUsersRoom(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);
  return (
    <RoomContextProvider>
      <div className="bg-black bg-opacity-30 backdrop-blur-sm h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
        <ChatList chatUser={usersRoom} />
        <MessageInput />
        <UserInfo />
      </div>
    </RoomContextProvider>
  );
}

export default Chat;
