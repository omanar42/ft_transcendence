import axios from "axios";
import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";

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
    .get("http://127.0.0.1:3000/auth/logout", { withCredentials: true })
    .then((res) => {
      console.log(res.data);
      if (res.data.message === "logout success") {
        window.location.href = "/login";
      }
    })
    .catch((err) => {
      console.log(err);
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
  };

  return <LoginInfo.Provider value={value}>{children}</LoginInfo.Provider>;
};

export default LoginInfo;
