import Avatar from "../assets/avatar.jpeg";
import './Chatlist.css';

const avatars = [Avatar, Avatar, Avatar, Avatar, Avatar, Avatar];
const chats = [
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "omanar",
    message: "Andoz eandk lyoum",
    time: "10.00 am",
  },
  {
    avatar: Avatar,
    username: "yessad",
    message: "Match nadi a sat",
    time: "6.00 am",
  },
  {
    avatar: Avatar,
    username: "yassin",
    message: "galo liya khsarto ?",
    time: "12.00 am",
  },
  {
    avatar: Avatar,
    username: "ilyas",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
  },
];
interface ListAvatars {
  avatar: string;
}

function ListAvatars({ avatar }: ListAvatars) {
  return (
    <li>
      <img className="rounded-full" src={avatar} alt="avatar" />
    </li>
  );
}

interface ListConversations {
    avatar: string,
    username: string,
    message: string,
    time: string, 
}

function ListConversations({ avatar, username, message, time }:ListConversations) {
  return (
    <li className="flex items-center gap-5 mb-6">
      <img className="h-[6rem] w-[6rem] rounded-full" src={avatar} alt="avatar" />
      <div className="overflow-hidden">
        <h1 className="text-2xl pb-2 font-extrabold">{username}</h1>
        <p className="text-xl">{message}</p>
      </div>
      <span className="text-xl font-semibold">{time}</span>
    </li>
  );
}
function ChatList({chatUser}) {
  return (
    <div className="col-span-1 flex flex-col items-center gap-5 overflow-hidden font-sans">
      <div className=" border-2 border-white border-opacity-20 rounded-lg flex flex-col items-center gap-5 pt-4 pb-4">
        <input
          className="w-11/12 h-[2.5rem] rounded-full pl-10 text-black outline-none"
          type="text"
          placeholder="search"
        />
        <ul className="flex gap-5 w-11/12">
          {avatars.map((avatar) => (
            <ListAvatars  avatar={avatar} />
          ))}
        </ul>
      </div>
      <ul className="p-4 scroll-container flex w-full flex-col overflow-auto">
        {chatUser.map((conv) => (
          <ListConversations
            avatar={conv.Avatar}
            username={conv.roomName}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
