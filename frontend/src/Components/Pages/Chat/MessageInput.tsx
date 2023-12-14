import { IoIosSend } from "react-icons/io";


function MessageInput() {
  return (
    <div className="border-2 border-white rounded-2xl border-opacity-20 col-span-3 flex flex-col justify-between">
        <div className=' flex-1' ></div>
        <div className='h-[6rem] pl-10 pr-10 border-t-2 border-opacity-20 border-white flex justify-between items-center gap-3'>
            <input className='h-14 flex-1 outline-none rounded-3xl pl-10 text-black' type='text' placeholder='Write message' />
            <IoIosSend className="text-6xl text-pink-100"/>
        </div>
    </div>

  )
}

export default MessageInput