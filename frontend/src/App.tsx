import {
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";
import LoginInfo from "./Contexts/LoginContext";
import { useContext, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client';
import { BACKEND_URL } from "./Config";

function App() {
  const {setuserInfo, setConnected, setVerifed, setIsLoading, setToken, setSocket, setGameSocket}:any = useContext(LoginInfo);

  useEffect(()=>{
    fetchData();
  },[]);
  
  const fetchData = async ()=>{
    try{
      const response = await axios.get(`${BACKEND_URL}/users/info`, {withCredentials: true});
     
      setuserInfo((prevstate: any)=>({
        ...prevstate,
        avatar:response.data.avatar,
        fullname:response.data.fullname,
        status:response.data.status,
        username:response.data.username,
        twoFactor:response.data.twoFactor
      }))
      const newtoken = await axios.get(`${BACKEND_URL}/auth/token`, {withCredentials: true});
      setToken(newtoken.data);
      setIsLoading(false);
      if (newtoken.data){
        const newSocket =  io("127.0.0.1:3000/chat", {
          query: {token:newtoken.data},
        })
        const gameSocket = io("127.0.0.1:3000/game", {
          query: {token:newtoken.data},
        })
        newSocket.on("disconnect", () => {
          
          setConnected(false);
        });
        setSocket(newSocket);
        setGameSocket(gameSocket);
        setVerifed(localStorage.getItem('verifed'));

      }
    }
    catch(error){
      setIsLoading(false);
    }
  }

  return (  
        <RouterProvider router={routermin} />
  );
}

export default App;
