import { useContext, useEffect, useRef, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../../Config";
import "react-toastify/dist/ReactToastify.css";
import "./settings.css";

function TwoFa({ isOPen, setIsOpen, setIsCheked }: any) {
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const Success = () => toast.success("2FA Verified successfully");
  const error = () => toast.error("Wrong code");
  useEffect(() => {
    const getQrCode = async () => {
      try {
        const qrCode = await axios.get(
          `${BACKEND_URL}/setting/enable2FA`,
          {
            withCredentials: true,
          }
        );
        setQrCode(qrCode.data.qrCodeUrl);
      } catch (err) {
      }
    };
    if (isOPen) {
      getQrCode();
    }
  }, []);

  const handelConfirm = async () => {
    try {
      const confirm = await axios.post(
        `${BACKEND_URL}/users/verify2fa`,
        { token: code },
        { withCredentials: true }
      );

        setIsCheked(true);
        setIsOpen(false);
        Success();
      
    } catch (err) {
      error();
    }
  };

  return (
    <div className="modal flex justify-center items-center text-white font-bold">
      <div className="flex p-[2rem] bg-black relative border-white border-2 border-opacity-20 rounded-2xl w-[95rem] h-[60rem] flex-col items-center justify-center gap-[5rem]">
        <h1 className="text-6xl">Set up Two-factor Authentication</h1>
        <p className="text-2xl">
          Scan the QR code below using your phone's authenticator app.
        </p>
        <img className="w-[20rem] h-[20rem]" src={qrCode} />
        <input
          onChange={(e) => setCode(e.target.value)}
          value={code}
          placeholder="Verification code"
          className="w-2/6 h-[4rem] pl-4 outline-none bg-dark-100 text-3xl border-2 border-white border-opacity-20 rounded-2xl bg-opacity-"
        />
        <div className="flex w-1/2 justify-around text-4xl">
          <button
            onClick={handelConfirm}
            className="bg-pink-600 p-3 rounded-2xl hover:bg-white hover:text-black hover:duration-[0.2s]"
          >
            Confirm
          </button>
          <button
            className="hover:bg-white hover:text-black rounded-2xl p-4 hover:duration-[0.2s]"
            onClick={() => setIsOpen(!isOPen)}
          >
            Cancel
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-4xl hover:text-black hover:bg-white rounded-full p-2 hover:duration-[0.2s]"
          onClick={() => setIsOpen(!isOPen)}
        >
          X
        </button>
      </div>
    </div>
  );
}

function Settings() {
  const { userInfo, setuserInfo }: any = useContext(LoginInfo);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [Fullname, setFullname] = useState(userInfo.fullname);
  const [Username, setUsername] = useState(userInfo.username);
  const [isOPen, setIsOpen] = useState(false);
  const imageRef = useRef(null);
  const [isCheked, setIsCheked] = useState<boolean>(userInfo.twoFactor);
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
        await axios.post(
          `${BACKEND_URL}/setting/updateAvatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      await axios.post(
        `${BACKEND_URL}/setting/updateProfile`,
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
      const response = await axios.get(`${BACKEND_URL}/users/info`, {withCredentials: true});
     
      setuserInfo((prevstate: any)=>({
        ...prevstate,
        avatar:response.data.avatar,
        fullname:response.data.fullname,
        status:response.data.status,
        username:response.data.username,
        twoFactor:response.data.twoFactor
      }))
      toast.success("Profile updated successfully");
    } catch (err) {
    }
  };
  const hand2fa = async ()=> {
    if (isCheked){
      setIsOpen(false);
      setIsCheked(false);
      const disable2fa = await axios.get(`${BACKEND_URL}/setting/disable2FA`, {withCredentials: true});
      if (disable2fa.data.message === "2FA disabled"){
        toast.success("2FA disabled successfully");
      }
      else toast.error("Something went wrong");
    }
    else{
      setIsOpen(true);}
  }

  return (
    <motion.div
    
    initial={{ y: "100%" }}
    animate={{ y: "0" }}
    exit={{y: "100%" }} 
    className="flex justify-center items-center h-full mt-4">
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
      {isOPen && (
        <TwoFa
          isOPen={isOPen}
          setIsOpen={setIsOpen}
          isCheked={isCheked}
          setIsCheked={setIsCheked}
        />
      )}
      <div className="text-white text-opacity-50  border-[1px] border-pink-600 w-140 h-[62rem] bg-white backdrop-blur-md bg-opacity-5 rounded-[2rem] flex flex-col items-center justify-center">
        <div className="w-2/3 h-5/6">
          <h1 className="text-7xl mb-6">Acount Settings</h1>
          <div className="border-[1px] border-blue-600 h-5/6 bg-black bg-opacity-40 rounded-3xl flex flex-col gap-[5rem] justify-center items-center">
            <div className="flex justify-around items-center w-3/4">
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
              <div className="flex flex-col gap-[2rem] text-2xl">
                <h1 className="text-4xl">Full name</h1>
                <input
                  className="bg-white bg-opacity-10 h-[4rem] rounded-full pl-4 outline-none"
                  onChange={(e) =>{ 
                    const value = e.target.value;
                    if(value.length <= 20)
                      setFullname(e.target.value)
                    else toast.error("Full name must be less than 20 characters")
                  }}
                  value={Fullname}
                />
                <h1 className="text-4xl">User name</h1>
                <input
                   onChange={(e) =>{ 
                    const value = e.target.value;
                    if(value.length <= 20)
                      setUsername(e.target.value)
                    else toast.error("Username must be less than 20 characters")
                  }}
                  className="bg-white bg-opacity-10 h-[4rem] rounded-full pl-4 outline-none"
                  value={Username}
                />
                <h1 className="text-4xl tracking-4">Enable (2FA)</h1>
                <label className="flex items-center relative w-max outline-none cursor-pointer select-none">
                  <span className="text-lg font-bold mr-3">Enabled</span>
                  <input
                    onChange={hand2fa}
                    checked={isCheked}
                    type="checkbox"
                    className="appearance-none transition-colors cursor-pointer outline-none w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
                  />
                  <span className="absolute font-medium text-xs uppercase right-1 text-white">
                    {" "}
                    OFF{" "}
                  </span>
                  <span className="absolute font-medium text-xs uppercase right-8 text-white">
                    {" "}
                    ON{" "}
                  </span>
                  <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
                </label>
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
                onClick={() => toast.success("Canceled")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
