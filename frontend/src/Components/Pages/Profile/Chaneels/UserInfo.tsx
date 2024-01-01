import Avatar from "../assets/avatar.jpeg";
import { MdOutlineBlock } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import "./ChaneelsList.css";

const ProgressBar = ({ value }) => {
  return (
    <div>
      <h2>Progress Bar</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${value}%` }}>
          {value}%
        </div>
      </div>
    </div>
  );
};


function UserInfo() {
  return (
    <div className="col-span-1 flex flex-col gap-10 items-center justify-center backdrop-blur">
      <img className="rounded-full h-[15rem]" src={Avatar} />
      <h1 className="ww text-3xl font-bold">mrobaii</h1>
      <div className="flex items-center gap-5">
        <FaShare className="text-4xl"></FaShare>
        <ProgressBar value={64.3 } />
      </div>
    </div>
    
  );
}

export default UserInfo;
