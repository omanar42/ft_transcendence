import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";
import MessageInput from "../Home/MessageInput";
import CreateRoom from "./CreateRoom";
import { useContext, useEffect, useState } from "react";
import { Room } from "./RoomList";
import axios from "axios";
import { RoomContextProvider } from "../../../../Contexts/RoomContext";
import { motion } from "framer-motion";
export default function Rooms() {
  const [toggelModal, setToggelModal] = useState(false);
  const [channelsList, setChannelsList] = useState<Room[]>([]);
  const handeltoggelModal = () => {
    setToggelModal(!toggelModal);
  };
  const AddChannelToList = (Room: Room) => {
    setChannelsList((list) => [...list, Room]);
  };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/chat/rooms", {
          withCredentials: true,
        });
        setChannelsList(response.data);
        console.log("Response data", response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, []);
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
    >
      <RoomContextProvider>
        <div className="bg-black bg-opacity-30 backdrop-blur-sm h-[62rem] grid  relative grid-cols-5 gap-x-2 mt-4">
          {toggelModal && (
            <CreateRoom
              AddChannelToList={AddChannelToList}
              CloseModal={() => setToggelModal(false)}
            />
          )}
          <RoomList handeltoggelModal={handeltoggelModal} List={channelsList} />
          <MessageInput />
          <RoomMembers />
        </div>
      </RoomContextProvider>
    </motion.div>
  );
}
