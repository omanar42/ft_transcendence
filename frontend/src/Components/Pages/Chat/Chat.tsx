import ChatList from "./ChatList";
import Header from "./Header";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import Avatar from "./assets/avatar.jpeg";

const Chat = () => {
  return (
    <div className="w-[140rem]  max-w-140 -dark rounded-3xl text-white ml-auto mr-auto">
      <Header />
      <div className="bg-dark-100 h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
        <ChatList />
        <MessageInput />
        <UserInfo />
      </div>
    </div>
  );
};

export default Chat;
