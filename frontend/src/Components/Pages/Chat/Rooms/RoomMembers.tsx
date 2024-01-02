import Avatar from "../assets/avatar.jpeg";
import { MdOutlineBlock } from "react-icons/md";
import { FaShare } from "react-icons/fa";

const chats = [
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "omanar",
    message: "Andoz eandk lyoum",
    time: "10.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "yessad",
    message: "Match nadi a sat",
    time: "6.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "yassin",
    message: "galo liya khsarto ?",
    time: "12.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "ilyas",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
];

function RenderMembers({ avatar, username }) {
  return (
    <li className="flex gap-[5rem] items-center" key={Date.now()}>
      <h1>{username}</h1>
      <img className="w-[6rem] rounded-full status" src={avatar} alt="avatar" />
    </li>
  );
}

function RoomMembers() {
  return (
    <div className="flex flex-col gap-[0.5rem] overflow-hidden">
      <div className="pt-7 pb-7 border-2 text-center border-white border-opacity-20 rounded-2xl">
        <h1 className="text-4xl">Room Members</h1>
      </div>
      <ul className="flex overflow-auto flex-col gap-[1rem] items-end pr-[3rem] w-full text-2xl border-2 border-white border-opacity-20 rounded-2xl">
        {chats.map((memeber, i) => (
          <RenderMembers avatar={memeber.avatar} username={memeber.username} key={i}/>
        ))}
      </ul>
    </div>
  );
}

export default RoomMembers;
