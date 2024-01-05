import React from 'react'
import Avatar from '../../assets/avatar.jpeg'
import NavigationLink from '../../Utils/NavigationLink';

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


  function ListFriends({avatar, username}){
    return(
        <li className='text-white flex items-center gap-[5rem] border-2 border-white border-opacity-20 pl-4 pr-4 rounded-xl'>
            <img className='h-[7rem] rounded-full' src={avatar} />
            <div className='flex flex-col gap-[1rem]'>
                <h1 className='text-2xl'>{username}</h1>
                <button className='text-2xl cursor-pointer bg-pink-600 rounded-lg p-1 hover:bg-white hover:text-black hover:duration-[0.2s]'>Add Friend</button>
            </div>
        </li>
    )
  }
function Friends() {

  return (
        <div className='ml-auto mr-auto w-[140rem] h-[62rem] rounded-xl bg-dark-100 p-[3rem] border-2 border-white border-opacity-20'>
        <div className=' flex flex-col border-opacity-20'>
            <header className='h-[7rem] bg-dark rounded-xl text-white flex items-center justify-center'>
                <nav className='flex justify-between  w-2/3 text-2xl pr-[3rem] pl-[3rem]'>
                    <NavigationLink to="Blocked">Blocked</NavigationLink>
                    <NavigationLink to="Blocked">All friends</NavigationLink>
                    <NavigationLink to="Blocked">Requested</NavigationLink>
                </nav>
            </header>
            <ul className='mt-[5rem] flex flex-wrap gap-[3rem] justify-center'>
                {chats.map(()=>(
                    <ListFriends avatar={chats[0].avatar} username={chats[0].username} />
                ))}
            </ul>
        </div>
        </div>
  )
}

export default Friends;
