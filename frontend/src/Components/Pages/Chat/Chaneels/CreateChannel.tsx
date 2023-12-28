import React, { useState } from "react";
import "./CreateChannel.css";
import Avatar from "../assets/avatar.jpeg";

interface InputBox {
  value?: string;
  placeholder: string;
  type: string;
  custom: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: string;
}

function InputBox({value, children, placeholder, type, custom, onChange }: InputBox) {
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

function SelectType({setType, type}){

  return(<select value={type} className="text-black outline-none" onChange={(event)=>setType(event.target.value)}>
    <option value={"public"}>Public</option>
    <option value={"Protected"}>Protected</option>
    <option value={"Private"}>Private</option>
  </select>)
}

function CreateChannel({ sendChannelComp, CloseModal }) {
  const [channelName, setChannelName] = useState("");
  const [Roomtype, setRoomtype] = useState("");

  const handlSubmit = (event) => {

    event.preventDefault();
    if (channelName !== ""){
      const channel = {
        avatar: Avatar,
        message: "",
        time: "",
        username: channelName,
      };
      sendChannelComp(channel);
      CloseModal();
    }
  
  };


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
            setChannelName(event.target.value)
            console.log(channelName);
          }
          }
          value={channelName}
        >
          Room Name
        </InputBox>
        <div className="flex w-10/12  text-4xl justify-between">
          <h1>Room Type</h1>
        <SelectType setType={setRoomtype} type={Roomtype}/>
        </div>
        {Roomtype === "Protected" &&
          <InputBox placeholder="Enter your password" type="password" custom="outline-none font-bold">
            Password
          </InputBox>
        }
        <button type="submit" className="text-4xl uppercase font-bold  w-[20rem] bg-dark border-[2px] p-5 rounded-xl">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateChannel;
