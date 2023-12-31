import { createContext, useContext, useState } from "react";
import  {Socket} from 'socket.io-client';


const LoginInfo = createContext({});

export interface userInfo{
    avatar:string;
    fullname:string;
    status:string;
    username:string;
  }
  
  const userLoginInfo:userInfo = {
    avatar:"",
    fullname:"",
    status:"",
    username:"",
  };

  
export const useLoginInfo = ()=> useContext(LoginInfo);
export const LoginInfoContext = ({children}:any)=>{
    const [isLogged, setIsLogged] = useState(false);
    const [userInfo, setuserInfo] = useState<userInfo>(userLoginInfo);
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);

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
        socket
    }

    return(<LoginInfo.Provider value={value}>{children}</LoginInfo.Provider >)
}

export default LoginInfo;