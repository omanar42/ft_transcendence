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


function App() {
  const {setuserInfo, userInfo, isLogged, setIsLogged, setToken, setSocket,setGameSocket, socket,gamesocket, token}:any = useContext(LoginInfo);

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
      }))
      if (userInfo.username){
        setIsLogged(true);
        // <Navigate to="/home" />
      }
      const newtoken = await axios.get("http://127.0.0.1:3000/auth/token", {withCredentials: true});
      setToken(newtoken.data);
      if (newtoken.data){
        const newSocket =  io("127.0.0.1:3000/chat", {
          query: {token:newtoken.data},
        })
        const gameSocket = io("127.0.0.1:3000/game", {
          query: {token:newtoken.data},
        })
        setSocket(newSocket);
        setGameSocket(gameSocket);

      }
      console.log(newtoken.data)
    }
    catch(error){
      console.error(error);
    }

  }

  return (  
        <RouterProvider router={routermin} />
  );
}

export default App;
