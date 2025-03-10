import login from "./assets/login.png";
import intra from "./assets/42.png";
import google from "./assets/Google.png";
import Logo from "../../../assets/logo.png";
import axios from "axios";
import {motion} from "framer-motion";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../../Config";

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
  
  const handLogging = async () =>{
    try{
      await axios.get(`${BACKEND_URL}/auth/token`);
    }catch(error){
      toast.error(error.response.data.message);
    }
  }
  return (
    <motion.div 
    initial={{width:0}}
    animate={{width:"100%"}}
    exit={{width:0}}className="h-screen flex justify-center items-center pl-10 pr-10">
      <div className="grid grid-cols-3 max-w-140">
        <div className="flex flex-col gap-20 bg bg-gradient-to-r from-dark to-dark-100 justify-center relative items-center col-span-1">
          <img className="absolute top-40" src={Logo} alt="logo" />

          <a onClick={handLogging} href={`${BACKEND_URL}/auth/42`}>
          <Button
            icon={intra}
            text="Sing in with intra"
            bgColor="bg-black"
            textColor="text-white"
          />
          </a>
          <a href={`${BACKEND_URL}/auth/google`}>
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
    </motion.div>
  );
}

export default Login;
