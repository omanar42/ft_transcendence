import React, { useState } from "react";
import "./CreateChannel.css";

interface InputBox{
  value:string,
  placeholder:string,
  type:string,
  custom:string
}

function InputBox({ value, placeholder, type, custom}:InputBox) {
  return (
    <div className="flex w-10/12 justify-between items-center">
      <h2 className="text-4xl uppercase">{value}</h2>
      <input
        className={`w-[30rem] text-3xl pl-10 rounded-lg h-[4rem] text-black ${custom} `}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

function CreateChannel() {
  const [pass, setPass] = useState(true);

  return (
    <div className="modal flex justify-center items-center">
      <form className="w-3/6 h-3/6  flex flex-col items-center border-2 bg-dark-100 rounded-3xl justify-around border-white border-opacity-20">
        <h1 className="text-6xl uppercase font-bold pt-5 pb-10 ">
          Create new channel
        </h1>
        <InputBox
          value="Create channel"
          placeholder="Name your chaneel..."
          type="text"
          custom=""
        />
          <InputBox
          value="Protected"
          placeholder=""
          type="checkbox"
          custom="h-[2.4rem]"
        />
        {pass && (
          <InputBox
            value="Passowrd"
            placeholder="Enter your password"
            type="password"
            custom=""
          />
        )}
        <button className="text-4xl uppercase font-bold  w-[20rem] bg-dark border-[2px] p-5 rounded-xl">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateChannel;
