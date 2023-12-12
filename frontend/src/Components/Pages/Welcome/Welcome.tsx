import { Logo, intra, google, login } from "../Login";
import { FaCamera } from "react-icons/fa";
import "./Welcome.css";
import { useState } from "react";



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
      <button className="submit-btn border-2 font-bold tracking-4 pl-10 pr-10 h-10 self-center hover:{bg-white}"
              
      >
        Submit
      </button>
    </div>
  );
}
function Welcome() {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);


  const userNamedata = (event) =>{
    
  }

  return (
    <div className="h-screen flex justify-center items-center pl-10 pr-10">
      <div className="grid grid-cols-3 max-w-140">
        <div className="col-span-2">
          <img className="w-full h-full" src={login} />
        </div>
        <div className="flex flex-col gap-20 bg bg-gradient-to-r from-dark to-dark-100 to-dark-200 justify-center relative items-center col-span-1">
          <img className="absolute top-40" src={Logo} alt="logo" />
          <div className="text-white wlc-form flex flex-col gap-10 justify-center items-center border-2  p-10">
            <h1 className="text-white text-3xl font-bold">
              Welcome! Let's create your profile
            </h1>
            <ImageUploader />
            <UploeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
