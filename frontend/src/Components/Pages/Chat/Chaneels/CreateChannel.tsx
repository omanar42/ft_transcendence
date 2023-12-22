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

function CreateChannel({ sendChannelComp, CloseModal }) {
  const [channelName, setChannelName] = useState("");
  const [isProtected, setIsProtected] = useState(false);

  const handlSubmit = (event) => {

    event.preventDefault();

    const channel = {
      avatar: Avatar,
      message: "",
      time: "",
      username: channelName,
    };
    sendChannelComp(channel);
    CloseModal();
  };

  return (
    <div className="modal flex justify-center items-center">
      <form
        onSubmit={handlSubmit}
        className="w-3/6 h-3/6  flex relative flex-col items-center border-2 bg-dark-100 rounded-3xl justify-around border-white border-opacity-20"
      >
        {/* <button
          onClick={CloseModal}
          className=" absolute top-[-3.5rem] left-[0.3rem] text-[7rem] text-pink-100"
        >
          &times;
        </button> */}
        <h1 className="text-6xl uppercase font-bold pt-5 pb-10 ">
          Create new channel
        </h1>
        <InputBox
          placeholder="Name your chaneel..."
          type="text"
          custom=""
          onChange={(event) => {
            setChannelName(event.target.value)
            console.log(channelName);
          }
          }
          value={channelName}
        >
          Channel Name
        </InputBox>
        <InputBox placeholder="" type="checkbox" custom="h-[2.4rem] " onChange={()=>setIsProtected(!isProtected)}>
          Protected
        </InputBox>
        {isProtected &&
          <InputBox placeholder="Enter your password" type="password" custom="">
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
