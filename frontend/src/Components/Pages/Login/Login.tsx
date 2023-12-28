import React from "react";
import login from "./assets/login.png";
import intra from "./assets/42.png";
import google from "./assets/Google.png";
import Logo from "../../../assets/logo.png";
interface ButtonType {
  icon: string;
  text: string;
  bgColor: string;
  textColor: string;
}

function Button({ icon, text, bgColor, textColor }: ButtonType) {
  return (
    <button
      className={`${bgColor} ${textColor} font-extrabold flex text-2xl gap-20 w-30rem h-20 items-center  pl-10 pr-10 rounded-full`}
    >
      <img className="h-16" src={icon} alt={text} />
      {text}
    </button>
  );
}

function Login() {
  return (
    <div className="h-screen flex justify-center items-center pl-10 pr-10">
      <div className="grid grid-cols-3 max-w-140">
        <div className="flex flex-col gap-20 bg bg-gradient-to-r from-dark to-dark-100 to-dark-200 justify-center relative items-center col-span-1">
          <img className="absolute top-40" src={Logo} alt="logo" />

          <a href="http://localhost:3000/auth/42">
          <Button
            icon={intra}
            text="Sing in with intra"
            bgColor="bg-black"
            textColor="text-white"
          />
          </a>
          <a href="http://localhost:3000/auth/google">
            <Button
              icon={google}
              text="Sing in with Google"
              bgColor="bg-white"
              textColor="text-black"
            />
          </a>
        </div>
        <div className="col-span-2">
          <img className="w-full h-full" src={login} />
        </div>
      </div>
    </div>
  );
}

export default Login;
