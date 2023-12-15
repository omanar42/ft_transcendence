import ChaneelsList from "./ChaneelsList";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import CreateChannel from "./CreateChannel";
import { useState } from "react";

function Chaneels() {
  const [toggelModal, setToggelModal] = useState(false);

  const handeltoggelModal = () =>{
    setToggelModal(!toggelModal);
  }

  return (
    <div>
     { toggelModal && <CreateChannel />}
      <div className="bg-dark-100 h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
        <ChaneelsList CreateChaneel={handeltoggelModal} />
        <MessageInput />
        <UserInfo />
      </div>
    </div>
  );
}

export default Chaneels;
