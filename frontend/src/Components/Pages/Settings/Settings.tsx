import { Logo, login } from "../Login";
import { FaCamera } from "react-icons/fa";
import "./Settings.css";
import { useEffect, useState } from "react";

function ImageUploader() {
  return (
    <div className="image-uploead h-52 w-52 rounded-full border-2 border-dark-300 flex justify-center items-center">
      <input type="file" id="fileInput" className="hidden" />
      <label htmlFor="fileInput">
        <FaCamera className="text-dark-300 cursor-pointer" size={30}></FaCamera>
      </label>
    </div>
  );
}

function UploeadForm() {
  return (
    <div className="w-full flex flex-col gap-10">
      <h2 className="text-2xl text-dark-300 font-bold">
        Let's pick your @username
      </h2>
      <input
        className=" outline-none rounded-lg h-14 bg-dark-300 pl-6 text-xl font-bold"
        type="text"
        placeholder="Enter your username"
      />
      <button className="submit-btn border-2 font-bold tracking-4 pl-10 pr-10 h-10 self-center hover:{bg-white}">
        Submit
      </button>
    </div>
  );
}
function Settings() {
  const [FullName, SetFullName ] = useState('Ossama Manar');
  const [UserName, SetUserName ] = useState('Omanar');
  const [Email, SetEmail ] = useState('omanar@gmail.com');


  // useEffect(() => {
  //   axios.get('/api/users/khona').then((res) => setValue(res.data.username))
  // }, [])
  return (
    <div className="h-screen flex justify-center items-center pl-10">
      <div className="w-[1152px] h-[636px] backdrop-blur border border-pink-100 rounded-[16px]">
        <div className="pl-[250px] pt-[24px] text-white font-Orbitron text-4xl">
          Account Settings
        </div>
        <div className="pt-[10px] pl-[250px] ">
          <div className="w-[614px]  h-[496px] border border-blue-400 backdrop-blur-xl rounded-[12-px]">
          <div className=" bg-white w-[100px] h-[100px] rounded-full "></div>
          <div className="  flex-row pl-[319px]">
            <p className=" font-bold text-xl text-white">Full Name</p>
            <input type='text' value={FullName} onChange={(event) => SetFullName(event.target.value)}  className=" font-Orbitron text-white text-center w-[263px] h-[37px] rounded-full bg-transparent border "></input>
            <p className="font-bold text-xl text-white pt-12">Last Name</p>
            <input type='text' value={UserName} onChange={(event) => SetUserName(event.target.value)}  className=" font-Orbitron text-white text-center w-[263px] h-[37px] rounded-full bg-transparent border "></input>
            <p className=" text-xl font-bold text-white pt-12">E-mail</p>
            <input type='text' value={Email} onChange={(event) => SetEmail(event.target.value)}  className=" font-Orbitron  text-white text-center w-[263px] h-[37px] rounded-full bg-transparent border "></input>
            <div className="pl-[31px] pt-[100px] space-x-[38px]">
            <button className=" font-Orbitron  text-2xl w-[83px] h-[25px] text-white">Cancel</button>
            <button className=" font-Orbitron  text-2xl w-[83px] h-[25px] text-white">Aplly</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
