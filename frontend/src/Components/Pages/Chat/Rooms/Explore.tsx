import   { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import roomIcon from "../../../../assets/roomIcon.png";
import { ToastContainer, toast } from "react-toastify";
import "./CreateRoom.css";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../../../Config";
export interface UnjoinedRoom {
  avatar: string; // assuming avatar is a string URL or similar
  time?: string;
  roomName: string;
  roomType: string;
  roomPassword?: string;
  userName?: string;
  roomId: string;
  setRooms: Function;
}
function ListRooms({
  avatar,
  roomName,
  roomType,
  roomId,
  setRooms,
}: UnjoinedRoom) {
  const [isOPen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");

  const joinRoom = async () => {
    const dataToSend = {
      roomId: roomId,
      password: password,
    };

    axios
      .post(`${BACKEND_URL}/chat/joinRoom`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        toast.success("Joined Room Successfully");
        setRooms(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    setPassword("");
    setIsOpen(false);
  };

  return (
    <div>
      <motion.li
        initial={{ y: "100%" }}
        animate={{ y: 0, transition: { duration: 0.2 } }}
        exit={{ y: "100%" }}
        className="flex items-center justify-between mb-6 cursor-pointer border-2 border-white border-opacity-20 p-3 rounded-xl w-[25rem] hover:bg-white hover:bg-opacity-80 hover:border-pink-100 hover:text-black hover:duration-[0.3s] "
        key={roomId}
        onClick={() => setIsOpen(true)}
      >
        <div className="overflow-hidden flex items-center gap-5">
          <img className="h-[5rem] rounded-full" src={avatar} alt="avatar" />
          <h1 className="text-2xl pb-2 font-extrabold">{roomName}</h1>
        </div>
        <div className="flex flex-col ml-10 gap-[1rem] items-end">
          <span className="text-xl font-semibold">{roomType}</span>
          <button className="bg-pink-100 text-2xl rounded-xl p-2 font-bold w-[6rem] tracking-[0.4rem] leading-5">
            JOIN
          </button>
        </div>
      </motion.li>
      {isOPen && (
        <div className="modal  flex justify-center items-center">
          <div className="w-[60rem] relative h-[40rem] bg-white bg-opacity-10 border-2 border-white border-opacity-20 rounded-3xl flex flex-col items-center justify-center gap-[3rem]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute text-7xl text-pink-600 top-[0rem] left-[1rem]"
            >
              &times;
            </button>
            <img className="h-[10rem] rounded-full" src={avatar} alt="avatar" />
            <div className="flex justify-between w-2/3">
              <h1 className="text-2xl pb-2 font-extrabold">Room Name</h1>
              <h1 className="text-2xl pb-2 font-extrabold">{roomName}</h1>
            </div>
            <div className="flex justify-between w-2/3">
              <h1 className="text-2xl pb-2 font-extrabold">Room Type</h1>
              <h1 className="text-2xl pb-2 font-extrabold">{roomType}</h1>
            </div>
            {roomType === "PROTECTED" ? (
              <div>
                <h1 className="text-2xl pb-2 font-extrabold text-center">
                  Room Password
                </h1>
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  className="border-2 border-black bg-white  text-3xl bg-opacity-20 outline-none font-extrabold rounded-xl p-2 w-[20rem] text-white"
                  type="password"
                />
              </div>
            ) : (
              <></>
            )}
            <button
              onClick={joinRoom}
              className="bg-pink-600 h-[5rem] hover:bg-white hover:text-black hover:duration-[0.2s] text-2xl w-[10rem] rounded-xl p-2 font-bold  tracking-[0.4rem] leading-5"
            >
              JOIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function Explore() {
  const [rooms, setRooms] = useState<UnjoinedRoom[]>([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/chat/explore`, {
          withCredentials: true,
        });
        setRooms(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchRooms();
  }, []);

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
      className="flex items-center justify-center"
    >
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
      <div className="border-2 border-white w-full h-[62rem] bg-black bg-opacity-30 backdrop-blur-sm border-opacity-20 rounded-xl p-[5rem]">
        <ul className=" flex gap-[3rem] flex-wrap justify-center">
          {rooms.map((room, index) => (
            <ListRooms
              avatar={roomIcon}
              roomName={room.roomName}
              roomType={room.roomType}
              roomId={room.roomId}
              setRooms={setRooms}
              key={index}
            />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default Explore;
