import { createContext, useState, useContext} from "react";

export const RoomContext = createContext({});

export function RoomContextProvider({children}:any) {
    const [currentRoom, setCurrentRoom] = useState<number>(0);
    const [ownerSheep, setOwnersheep] = useState("");
    const value = {
        currentRoom,
        setCurrentRoom,
        setOwnersheep,
        ownerSheep
    }

    return(<RoomContext.Provider  value={value}>
        {children}
    </RoomContext.Provider>)
}
