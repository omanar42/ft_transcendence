import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import avatar from '../../../../assets/avatar.jpeg'


export interface UnjoinedRoom {
  avatar: string; // assuming avatar is a string URL or similar
  time: string;
  roomName: string;
  roomType: string;
  roomPassword?: string;
  userName?: string;
  roomId: string;
  setRooms: Function;
}
function ListRooms({ avatar,roomName, roomType, roomId, setRooms}: UnjoinedRoom) {


  const joinRoom = async () => {
     const dataToSend = {
      roomId: roomId,
    };
    
    axios.post('http://127.0.0.1:3000/chat/joinRoom' , dataToSend, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
      console.log('Response:', response.data);
      setRooms(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    console.log('Join room', dataToSend);
  };
  
  return (
    <li 
    className="flex items-center justify-between mb-6 cursor-pointer border-2 border-white border-opacity-20 p-3 rounded-xl w-[25rem] hover:bg-white hover:bg-opacity-80 hover:border-pink-100 hover:text-black hover:duration-[0.3s] "
    key={roomId}
    onClick={()=>joinRoom()}
    >
      <div className="overflow-hidden flex items-center gap-5">
        <img className="h-[5rem] rounded-full" src={avatar} alt="avatar" />
        <h1 className="text-2xl pb-2 font-extrabold">{roomName}</h1>
      </div>
      <div className="flex flex-col ml-10 gap-[1rem] items-end">
        <span className="text-xl font-semibold">{roomType}</span>
        <button className='bg-pink-100 text-2xl rounded-xl p-2 font-bold w-[6rem] tracking-[0.4rem] leading-5' >JOIN</button>
      </div>
    </li>
  );
}
function Explore() {
    const [rooms, setRooms] = useState<UnjoinedRoom[]>([]);
    useEffect(()=>{
        const fetchRooms = async () => {
            try {
              const response = await axios.get("http://127.0.0.1:3000/chat/explore", {
                withCredentials: true,
              });
              setRooms(response.data);
            } catch (error) {
              console.error(error);
            }
        }
        fetchRooms();
    },[]);

  return (
    <div className="flex items-center justify-center">
        <div className='border-2 border-white w-full h-[62rem] bg-dark-100 border-opacity-20 rounded-xl p-[5rem]'>
        <ul className=' flex gap-[3rem] flex-wrap justify-center'>
          {rooms.map((room)=>(
            <ListRooms avatar={avatar} roomName={room.roomName} roomType={room.roomType} roomId={room.roomId} setRooms={setRooms}/>
          ))}
        </ul>
        </div>
    </div>
  )
}

export default Explore;
