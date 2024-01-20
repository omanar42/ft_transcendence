import { Logo, login } from "../Login";
import "./Welcome.css";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import LoginInfo from "../../../Contexts/LoginContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ImageUploader({ setImage, setImageUrl, imageUrl, imageRef }: any) {
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
      toast.error("Images only");
    }
  };
  return (
    <div onClick={handelImageClick}>
      <img
        className="w-[20rem] cursor-pointer  border-4 border-pink-600 h-[20rem] rounded-full"
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
  );
}

function UploeadForm({Username, setUsername}: any) {
  return (
    <div className="w-full flex flex-col gap-10">
      <h2 className="text-2xl text-dark-300 font-bold">
        Let's pick your @username
      </h2>
      <input
        className=" outline-none rounded-lg h-14 bg-dark-300 pl-6 text-xl font-bold"
        type="text"
        placeholder="Enter your username"
        onChange={(e) =>{ 
          const value = e.target.value;
          if(value.length <= 20)
            setUsername(e.target.value)
          else toast.error("Username must be less than 20 characters")
        }}
        value={Username}
      />
    </div>
  );
}
function Welcome() {
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const imageRef = useRef(null);
  const { userInfo }: any = useContext(LoginInfo);
  const [Username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setImageUrl(userInfo.avatar);
    setUsername(userInfo.username);
  }, [userInfo.avatar, userInfo.name, userInfo.username]);
  const handelapply = async () => {
    try {
      if (image !== "" && image !== null) {
        const formData = new FormData();
        formData.append("file", image);
        await axios.post(
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
      if (Username !== "" && Username !== userInfo.username) {
     await axios.post(
        "http://127.0.0.1:3000/setting/updateUsername",
        {
          username: Username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      }
      navigate("/home");

      window.location.reload();
    } catch (err) {
        toast.error("Uplaoed avatar first");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center pl-10 pr-10">
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

      <div className="grid grid-cols-3 max-w-140">
        <div className="col-span-2">
          <img className="w-full h-full" src={login} />
        </div>
        <div className="flex flex-col gap-20 bg bg-gradient-to-r from-dark to-dark-100 justify-center relative items-center col-span-1">
          <img className="absolute top-40" src={Logo} alt="logo" />
          <div className="text-white  wlc-form flex flex-col gap-10 justify-center items-center border-2  p-10">
            <h1 className="text-white  text-3xl font-bold">
              Welcome! Let's create your profile
            </h1>
            <ImageUploader
              imageRef={imageRef}
              setImage={setImage}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />
            <UploeadForm Username={Username} setUsername={setUsername}/>
            <button 
            onClick={handelapply}
            className="submit-btn border-2 font-bold tracking-4 pl-10 pr-10 h-10 self-center hover:{bg-white}">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
