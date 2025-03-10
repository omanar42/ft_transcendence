import axios from "axios";
import { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";
import { BACKEND_URL } from "../Config";

const LoginInfo = createContext({});

export interface userInfo{
    avatar:string;
    fullname:string;
    status:string;
    username:string;
    twoFactor:boolean;
  }
  
  const userLoginInfo:userInfo = {
    avatar:"",
    fullname:"",
    status:"",
    username:"",
    twoFactor:false
  };

  
const Logout = () => {
  axios
    .get(`${BACKEND_URL}/auth/logout`, { withCredentials: true })
    .then((res) => {
      if (res.data.message === "logout success") {
        window.location.href = "/login";
        localStorage.removeItem("verifed");
      }
    })
    .catch(() => {
    });
};
export const useLoginInfo = () => useContext(LoginInfo);
export const LoginInfoContext = ({ children }: any) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userInfo, setuserInfo] = useState<userInfo>(userLoginInfo);
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gamesocket, setGameSocket] = useState<Socket | null>(null);
  const [verifed, setVerifed] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<string>("");
  const[connected, setConnected] = useState<boolean>(true);
  const value = {
    isLogged,
    setIsLogged,
    userInfo,
    setuserInfo,
    name,
    setName,
    token,
    setToken,
    setSocket,
    socket,
    isLoading,
    setIsLoading,
    Logout,
    setGameSocket,
    gamesocket,
    setVerifed,
    verifed,
    gameMode,
    setGameMode,
    connected,
    setConnected
    
  };

  return <LoginInfo.Provider value={value}>{children}</LoginInfo.Provider>;
};

export default LoginInfo;
