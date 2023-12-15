import ChatList from "./ChatList";
import MessageInput from "./MessageInput";
import UserInfo from "../Chaneels/UserInfo";

function Chat() {
  return (
    <div className="bg-dark-100 h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
      <ChatList />
      <MessageInput />
      <UserInfo />
    </div>
  );
}

export default Chat;
