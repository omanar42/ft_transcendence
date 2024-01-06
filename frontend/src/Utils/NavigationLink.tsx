import React from "react";
import { Link } from "react-router-dom";


interface NavigationLink{
    to:string,
    children:string,
    onClick?:React.MouseEventHandler<HTMLAnchorElement>;
}

function NavigationLink({to, children, onClick}: NavigationLink) {

    return(
    <Link
      to={to}
      className="hover:bg-pink-600 pl-4 pr-4 p-2 duration-75 hover:scale-[1.2] z-50 rounded-xl"
      onClick={onClick}
    >
      {children}
      </Link>
    );
  }
  
  export default NavigationLink;