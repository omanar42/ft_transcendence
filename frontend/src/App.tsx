import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";
import LoginInfo, { LoginInfoContext } from "./Contexts/LoginContext";
import { useContext, useEffect } from "react";
import axios from "axios";

function App() {
  const {setuserInfo, userInfo, isLogged, setIsLogged} = useContext(LoginInfo);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const response = await axios.get("http://127.0.0.1:3000/users/info", {withCredentials: true});
        setuserInfo((prevstate)=>({
          ...prevstate,
          avatar:response.data.avatar,
          fullname:response.data.fullname,
          status:response.data.status,
          username:response.data.username,
        }))
      }
      catch(error){
        console.error(error);
      }
    }
    fetchData();
    if (userInfo.username)
      setIsLogged(true);
  },[]);

  return (  
        <RouterProvider router={routermin} />
  );
}

export default App;
