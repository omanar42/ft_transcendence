import Avatar from "./assets/avatar.jpeg";
import { MdOutlineBlock } from "react-icons/md";
import { FaShare } from "react-icons/fa";

function UserInfo() {
  return (
    <div className="col-span-1 flex flex-col gap-10 items-center justify-center">
      <img className="rounded-full h-[15rem]" src={Avatar} />
      <h1 className="text-3xl font-bold">mrobaii</h1>
      <div className="flex items-center gap-5">
        <FaShare className="text-4xl"></FaShare>
        <span className="text-xl font-semibold">See Profile</span>
      </div>
      <div className="flex items-center gap-5">
        <MdOutlineBlock className="text-4xl text-red-700"></MdOutlineBlock>
        <span className="text-xl font-semibold">Block</span>
      </div>
    </div>
  );
}

export default UserInfo;
