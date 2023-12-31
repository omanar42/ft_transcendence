import React, { useState } from "react";
import "./Settings.css";
import ProfileImage from "./ProfileImage";
import CustomSwitch from "./CustomSwitch";

function Settings() {
  const [fullName, setFullName] = useState("Ossama Manar");
  const [userName, setUserName] = useState("Omanar");
  const [email, setEmail] = useState("omanar@gmail.com");

  return (
    <div className="flex h-screen items-center justify-center pl-10">
      <div className="h-[636px] w-[1152px] rounded-[16px] border border-pink-100 backdrop-blur">
        <div className="pl-[250px] pt-[24px] font-Orbitron text-4xl text-white">
          Account Settings
        </div>
        <div className="pl-[250px] pt-[10px] ">
          <div className="h-[496px] w-[614px] rounded-[12-px] border border-blue-400 backdrop-blur-xl">
            <div className="absolute left-[50px] top-[80px]">
              <ProfileImage initialImage="https://cdn.intra.42.fr/users/3fe187b98b948c31ae17b534ea656927/omanar.jpg" />
            </div>

            <div className="flex-row pl-[319px] pt-[80px]">
              <p className="text-xl font-bold text-white">Full Name</p>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-[37px] w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white"
              />

              <p className="pt-12 text-xl font-bold text-white">Last Name</p>
              <input
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="h-[37px] w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white"
              />

              <p className="pt-12 text-xl font-bold text-white">E-mail</p>
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-[37px] w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white"
              />

              <div className="pt-16">
                <div className=" flex h-[37px] w-[263px] items-center justify-center rounded-full border bg-transparent">
                  <p className=" m-4 text-center font-Orbitron text-white">
                    Two-Factor Authentication
                  </p>
                  <div className="">
                    <CustomSwitch />
                  </div>
                </div>
              </div>

              <div className="space-x-[38px] pl-[31px] pt-[55px]">
                <button className="h-[25px] w-[83px] font-Orbitron text-2xl text-white">
                  Cancel
                </button>
                <button className="h-[25px] w-[83px] font-Orbitron text-2xl text-white">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
