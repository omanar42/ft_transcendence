import { useContext, useState } from "react";
import { login } from "../Login";
import axios from "axios";
import LoginInfo from "../../../Contexts/LoginContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../Config";

function TwoFaVerfication() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const {setVerifed,}:any = useContext(LoginInfo);

    const handelSubmit = async () => {
        try {
            const confirm = await axios.post(
                `${BACKEND_URL}/users/verify2fa`,
                { token: code },
                { withCredentials: true }
                );
          if (confirm.data === "2FA verified successfully") {
            setVerifed(true);
            localStorage.setItem('verifed', JSON.stringify(true));
            navigate('/home', { replace: true });
          }
        } catch (err) {
        }
      };
  return (
    <div className="h-screen flex justify-center items-center pl-10 pr-10">
      <div className="grid grid-cols-3 max-w-140">
        <div className="col-span-2">
          <img className="w-full h-full" src={login} />
        </div>
        <div className="flex flex-col gap-20 bg bg-gradient-to-r from-dark to-dark-200 justify-center relative items-center col-span-1">
          <div className="text-white  flex flex-col gap-10 justify-center items-center  p-10">
            <h1 className="text-white  text-3xl font-bold">
              Two-Factor Verficiation
            </h1>
            <div className="flex flex-col w-full gap-[3rem] items-center">
              <span className="text-2xl text-dark-300 font-black">Enter your verification code</span>
              <input  
                onChange={(e) => setCode(e.target.value)}
                value={code}
                className="h-[4rem] text-2xl rounded-xl outline-none pl-[2rem] bg-dark-200 border-2 border-white border-opacity-20"/>
              <button 
                onClick={handelSubmit}
                className="h-[3rem] text-2xl w-[8rem] border-2 font-bold rounded-lg hover:text-black hover:bg-white hover:duration-[0.2s]" >Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFaVerfication;
