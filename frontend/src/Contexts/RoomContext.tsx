import { createContext, useState } from "react";

export const RoomContext = createContext({});

interface messageList {
    message: string;
    userName: string;
  }

export function RoomContextProvider({ children }: any) {
  const [currentRoom, setCurrentRoom] = useState<number>(0);
  const [ownerSheep, setOwnersheep] = useState("");
  const [messageList, setMessageList] = useState<messageList[]>([]);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [avatar, setAvatar] = useState<string>(
    "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
  );
  const [status, setStatus] = useState<boolean>(false);
  const [roomName, setRoomName] = useState("");
  const value = {
    currentRoom,
    setCurrentRoom,
    setOwnersheep,
    ownerSheep,
    setMessageList,
    messageList,
    avatar,
    setAvatar,
    setRoomName,
    roomName,
    settingsIsOpen,
    setSettingsIsOpen,
    setStatus,
    status
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
