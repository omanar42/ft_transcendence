import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";
import LoginInfo from "./Contexts/LoginContext";
import { useState } from "react";
import io from "socket.io-client"

export const socket = io("127.0.0.1:3000/chat");

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

function App() {
  const [userInfo, setuserInfo] = useState<userInfo>(userLoginInfo);
  const [name, setName] = useState("");
  return (
    <LoginInfo.Provider value={{userInfo, setuserInfo, name, setName}}>
      <RouterProvider router={routermin} />
    </LoginInfo.Provider>
  );
}

export default App;
