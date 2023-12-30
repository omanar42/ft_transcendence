import { createContext, useState, useContext} from "react";

export const RoomContext = createContext({});

export function RoomContextProvider({children}) {
    const [currentRoom, setCurrentRoom] = useState("");
    const value = {
        currentRoom,
        setCurrentRoom,
    }

    return(<RoomContext.Provider  value={value}>
        {children}
    </RoomContext.Provider>)
}
