import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";
import MessageInput from "../Home/MessageInput";
import CreateRoom from "./CreateRoom";
import { useEffect, useState } from "react";
import { Room } from "./RoomList";
import axios from "axios";
import { RoomContextProvider } from "../../../../Contexts/RoomContext";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../../../Config";

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
        const response = await axios.get(`${BACKEND_URL}/chat/rooms`, {
          withCredentials: true,
        });
        setChannelsList(response.data);
      } catch (error) {
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
          <RoomList handeltoggelModal={handeltoggelModal} List={channelsList} setChannelsList={setChannelsList} />
          <MessageInput setChannelsList={setChannelsList} />
          <RoomMembers />
        </div>
      </RoomContextProvider>
    </motion.div>
  );
}
