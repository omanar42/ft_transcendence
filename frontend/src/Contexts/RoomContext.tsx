import { createContext, useState, useContext} from "react";

export const RoomContext = createContext({});

export function RoomContextProvider({children}) {
    const [currentRoom, setCurrentRoom] = useState<number>(0);
    const value = {
        currentRoom,
        setCurrentRoom,
    }

    return(<RoomContext.Provider  value={value}>
        {children}
    </RoomContext.Provider>)
}
