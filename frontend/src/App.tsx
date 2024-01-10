import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";
import LoginInfo, { LoginInfoContext } from "./Contexts/LoginContext";
import { useContext, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";

function App() {
  const {setuserInfo, userInfo, setVerifed, setIsLoading, setIsLogged, setToken, setSocket, socket, token, gamesocket, setGameSocket, setIsCheked}:any = useContext(LoginInfo);

  useEffect(()=>{
  fetchData();
  console.log("App mounting...");
    // HandlScoket();
  },[]);
  
  const fetchData = async ()=>{
    try{
      const response = await axios.get("http://127.0.0.1:3000/users/info", {withCredentials: true});
     
      setuserInfo((prevstate: any)=>({
        ...prevstate,
        avatar:response.data.avatar,
        fullname:response.data.fullname,
        status:response.data.status,
        username:response.data.username,
        twoFactor:response.data.twoFactor
      }))
      const newtoken = await axios.get("http://127.0.0.1:3000/auth/token", {withCredentials: true});
      setToken(newtoken.data);
      setIsLoading(false);
      if (newtoken.data){
        const newSocket =  io("127.0.0.1:3000/chat", {
          query: {token:newtoken.data},
        })
        const gameSocket = io("127.0.0.1:3000/game", {
          query: {token:newtoken.data},
        })
        setSocket(newSocket);
        setGameSocket(gameSocket);
        setVerifed(localStorage.getItem('verifed'));

      }
    }
    catch(error){
      // console.error(error);
      setIsLoading(false);
    }

  }

  return (  
        <RouterProvider router={routermin} />
  );
}

export default App;
