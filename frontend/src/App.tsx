import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import { routermin } from "./Routes/Routes";
import { LoginInfoContext } from "./Contexts/LoginContext";


function App() {

  return (
      <LoginInfoContext>

        <RouterProvider router={routermin} />
      </LoginInfoContext>
  );
}

export default App;
