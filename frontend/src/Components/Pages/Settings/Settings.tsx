import { Logo, login } from "../Login";
import { FaCamera } from "react-icons/fa";
import "./Settings.css";
import { useEffect, useState } from "react";

function Settings() {
  const [FullName, SetFullName] = useState("Ossama Manar");
  const [UserName, SetUserName] = useState("Omanar");
  const [Email, SetEmail] = useState("omanar@gmail.com");

  // useEffect(() => {
  //   axios.get('/api/users/khona').then((res) => setValue(res.data.username))
  // }, [])
  return (
    <div className="flex h-screen items-center justify-center pl-10">
      <div className="h-[636px] w-[1152px] rounded-[16px] border  border-pink-100 backdrop-blur">
        <div className="pl-[250px] pt-[24px] font-Orbitron text-4xl text-white">
          Account Settings
        </div>
        <div className="pl-[250px] pt-[10px] ">
          <div className="h-[496px]  w-[614px] rounded-[12px] border border-blue-400 backdrop-blur-xl">
            <div className=" absolute  left-[50px] top-[80px] ">
              <div className="mx-auto w-64 text-center ">
                <div className="relative w-64">
                  <img
                    className="absolute h-64 w-64 rounded-full"
                    src="https://cdn.intra.42.fr/users/3fe187b98b948c31ae17b534ea656927/omanar.jpg"
                    alt=""
                  />
                  <div className="group absolute flex h-64 w-64 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200">
                    <img
                      className="hidden w-12 group-hover:block"
                      src="https://www.svgrepo.com/show/33565/upload.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex-row pl-[319px] pt-[80px]">
              <p className=" text-xl font-bold text-white">Full Name</p>
              <input
                type="text"
                value={FullName}
                onChange={(event) => SetFullName(event.target.value)}
                className=" h-[37px] w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white "
              ></input>

              <p className="pt-12 text-xl font-bold text-white">Last Name</p>
              <input
                type="text"
                value={UserName}
                onChange={(event) => SetUserName(event.target.value)}
                className=" h-[37px] w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white "
              ></input>
              <p className=" pt-12 text-xl font-bold text-white">E-mail</p>
              <input
                type="text"
                value={Email}
                onChange={(event) => SetEmail(event.target.value)}
                className=" h-[37px]  w-[263px] rounded-full border bg-transparent text-center font-Orbitron text-white "
              ></input>
              <div className="space-x-[38px] pl-[31px] pt-[100px]">
                <button className=" h-[25px]  w-[83px] font-Orbitron text-2xl text-white">
                  Cancel
                </button>
                <button className=" h-[25px]  w-[83px] font-Orbitron text-2xl text-white">
                  Aplly
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
