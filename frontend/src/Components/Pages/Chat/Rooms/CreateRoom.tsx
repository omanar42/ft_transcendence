import React, { useEffect, useState, useContext } from "react";
import "./CreateRoom.css";
import Avatar from "../assets/avatar.jpeg";
import { Room } from "./RoomList";
import LoginInfo from "../../../../Contexts/LoginContext";
import io from "socket.io-client";

export const socket = io(`127.0.0.1:3000/chat`);

interface InputBox {
  value?: string;
  placeholder: string;
  type: string;
  custom: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: string;
}

function InputBox({
  value,
  children,
  placeholder,
  type,
  custom,
  onChange,
}: InputBox) {
  return (
    <div className="flex w-10/12 justify-between items-center">
      <h2 className="text-4xl uppercase">{children}</h2>
      <input
        className={`w-[30rem] text-3xl pl-10 rounded-lg h-[4rem] text-black ${custom} `}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function SelectType({ setType, type }) {
  return (
    <select
      value={type}
      className="text-black outline-none"
      onChange={(event) => setType(event.target.value)}
    >
      <option value={"Public"}>Public</option>
      <option value={"Protected"}>Protected</option>
      <option value={"Private"}>Private</option>
    </select>
  );
}

function CreateRoom({ AddChannelToList, CloseModal }) {
  const [roomName, setroomName] = useState("");
  const [Roomtype, setRoomtype] = useState("Public");
  const [roomPassword, setroomPassword] = useState("");

  const { userInfo } = useContext(LoginInfo);

  const handlSubmit = (event) => {
    event.preventDefault();
    if (roomName !== "") {
      if (Roomtype === "Protected" && !roomPassword) return null;
      const Room: Room = {
        avatar: Avatar, // assuming avatar is a string URL or similar
        message: "Hello friends",
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        roomName: roomName,
        roomType: Roomtype,
        roomPassword: roomPassword,
        userName: userInfo.username,
      };
      socket.emit("createRoom", Room);
      CloseModal();
    }
  };
  useEffect(() => {
    const handleRoomCreated = (Room) => {
      AddChannelToList(Room);
    };

    socket.off("roomCreated").on("roomCreated", handleRoomCreated);

    // return () => {
    //     // Use the same function reference for adding and removing the listener
    //     socket.off("roomCreated", handleRoomCreated);
    // };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="modal flex justify-center items-center">
      <form
        onSubmit={handlSubmit}
        className="w-3/6 h-3/6  flex relative flex-col items-center border-2 bg-dark-100 rounded-3xl justify-around border-white border-opacity-20"
      >
        <button
          onClick={CloseModal}
          className=" absolute top-[-3.5rem] left-[0.3rem] text-[7rem] text-pink-100"
        >
          &times;
        </button>
        <h1 className="text-6xl uppercase font-bold pt-5 pb-10 ">
          Create new Room
        </h1>
        <InputBox
          placeholder="Name your Room..."
          type="text"
          custom="outline-none font-bold"
          onChange={(event) => {
            setroomName(event.target.value);
          }}
          value={roomName}
        >
          Room Name
        </InputBox>
        <div className="flex w-10/12  text-4xl justify-between">
          <h1>Room Type</h1>
          <SelectType setType={setRoomtype} type={Roomtype} />
        </div>
        {Roomtype === "Protected" && (
          <InputBox
            placeholder="Enter your password"
            type="password"
            custom="outline-none font-bold"
            onChange={(event) => {
              setroomPassword(event.target.value);
            }}
            value={roomPassword}
          >
            Password
          </InputBox>
        )}
        <button
          type="submit"
          className="text-4xl uppercase font-bold  w-[20rem] bg-dark border-[2px] p-5 rounded-xl"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateRoom;
