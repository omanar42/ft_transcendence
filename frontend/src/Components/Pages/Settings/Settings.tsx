import React, { useContext, useEffect, useRef, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Settings() {
  const { userInfo }: any = useContext(LoginInfo);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [Fullname, setFullname] = useState(userInfo.fullname);
  const [Username, setUsername] = useState(userInfo.username);

  const imageRef = useRef(null);

  const Worning = () => toast.error("Images only");

  const handelImageClick = () => {
    imageRef.current?.click();
  };
  const handelUpload = (e: any) => {
    const file = e.target.files[0];

    if (file && file.type.match("image")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      Worning();
    }
  };
  useEffect(() => {
    setImageUrl(userInfo.avatar);
    setFullname(userInfo.fullname);
    setUsername(userInfo.username);
  }, [userInfo.avatar, userInfo.name, userInfo.username]);

  const handelapply = async () => {
    try {
      if (image !== "") {
        const formData = new FormData();
        formData.append("file", image);
        const Avatar = await axios.post(
          "http://127.0.0.1:3000/setting/updateAvatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      const profile = await axios.post(
        "http://127.0.0.1:3000/setting/updateProfile",
        {
          username: Username,
          fullname: Fullname,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-full mt-4">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="text-4xl"
      />
      <div className="text-white text-opacity-50  border-[1px] border-pink-600 w-140 h-[62rem] bg-white backdrop-blur-md bg-opacity-5 rounded-[2rem] flex flex-col items-center justify-center">
        <div className="w-2/3 h-5/6">
          <h1 className="text-7xl mb-6">Acount Settings</h1>
          <div className="border-[1px] border-blue-600 h-5/6 bg-black bg-opacity-40 rounded-3xl flex flex-col gap-[5rem] justify-center items-center">
            <div className="flex justify-around items-center w-3/4">
              <div onClick={handelImageClick}>
                <img
                  className="w-[20rem] cursor-pointer  border-2 border-pink-600 h-[20rem] rounded-full"
                  src={imageUrl}
                />
                <input
                  type="file"
                  onChange={handelUpload}
                  ref={imageRef}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="flex flex-col gap-[2rem] text-2xl">
                <h1 className="text-4xl">Full name</h1>
                <input
                  className="bg-white bg-opacity-10 h-[4rem] rounded-full pl-4 outline-none"
                  onChange={(e) => setFullname(e.target.value)}
                  value={Fullname}
                />
                <h1 className="text-4xl">User name</h1>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white bg-opacity-10 h-[4rem] rounded-full pl-4 outline-none"
                  value={Username}
                />
              </div>
            </div>
            <div className="flex justify-around w-2/4 text-3xl font-bold">
              <button
                className="bg-pink-600 text-white pb-3 pt-1 pl-2 pr-2 rounded-xl hover:bg-white hover:text-black hover:duration-[0.2s]"
                onClick={handelapply}
              >
                Apply
              </button>
              <button 
                className="border-[1px] border-white rounded-xl border-opacity-20 hover:bg-white hover:text-black hover:duration-[0.2s] pl-2 pr-2"
                onClick={()=>window.location.reload()}
                >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
