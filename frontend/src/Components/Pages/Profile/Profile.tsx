import React, { useEffect, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
// const History = [
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/3fe187b98b948c31ae17b534ea656927/omanar.jpg",
//     username: "omanar",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/706afa441605e55226115a6b614145d2/omeslall.jpg",
//     username: "omeslall",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/e3821355391cc0c7d0978731afe7f585/hobenaba.JPG",
//     username: "hobenaba",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/6a531cbc0b00f0de3da69ab9b92951be/anlabchi.jpeg",
//     username: "anlabchi",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/5d3b5cd692fb000c68b0824d435c4ef4/hoakoumi.JPG",
//     username: "hoakoumi",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/4a4a69ca0ab2202fd3a3500c5ad40b88/achraiti.jpeg",
//     username: "achraiti",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/90afa6925ae367098a0e5ea463c24b31/nolahmar.JPG",
//     username: "nolahmar",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/a27acd192404aeb3bf7e76e0dd67cfd2/small_mezzine.jpeg",
//     username: "small_mezzine",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/4ff059069ef903c70d7cb000f3bad7e0/small_amaarifa.jpg",
//     username: "small_amaarifa",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/d0ac05e0e24c0d0a932a8c2ff83d833e/small_slouham.jpeg",
//     username: "small_slouham",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/f108b3d2ad145657c753cd4caad243cb/small_nben-ais.jpeg",
//     username: "small_nben-ais",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/a27acd192404aeb3bf7e76e0dd67cfd2/small_mezzine.jpeg",
//     username: "small_mezzine",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/4ff059069ef903c70d7cb000f3bad7e0/small_amaarifa.jpg",
//     username: "small_amaarifa",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/d0ac05e0e24c0d0a932a8c2ff83d833e/small_slouham.jpeg",
//     username: "small_slouham",
//   },
//   {
//     avatar:
//       "https://cdn.intra.42.fr/users/f108b3d2ad145657c753cd4caad243cb/small_nben-ais.jpeg",
//     username: "small_nben-ais",
//   },
// ];

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;
  const url = "../../../../public/achievements/";

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }
  return (
    <ul className="flex items-center justify-between gap-[2rem]">
      <div>
        {images.map((image, index) => {
          // console.log()
          return (
            <div
              className={`
               ${
                 index === current
                   ? "opacity-100 duration-[0.4s] scale-[1.1]"
                   : "opacity-0 duration-[0.2s]"
               }
              `}
              key={index}
            >
              {/* <h1>{image}</h1> */}
              {index === current && (
                <div className="flex flex-col items-center gap-[2rem]">
                  <h1 className="text-4xl font-bold text-white">{image}</h1>
                  <div className=" flex items-center">
                    <GrCaretPrevious
                      className="text-8xl cursor-pointer animate-pulse text-green-600"
                      onClick={prevSlide}
                    />
                    <img
                      className="h-[20rem] border-4 border-pink-500 w-[20rem]  rounded-full"
                      src={url + image + ".png"}
                      alt="travel image"
                    />

                    <GrCaretNext
                      className="text-8xl cursor-pointer animate-pulse text-green-600"
                      onClick={nextSlide}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ul>
  );
};


const ProgressBar = ({ bgColor, level }: any) => {

  const fillerStyles = {
    height: '100%',
    width: `${Number(level) * 100 % 100}%`,
    backgroundColor: bgColor,
    borderRadius: 'inherit',
    textAlign: 'center'
  }

  const labelStyles = {
    // padding: 5,
    color: 'white',
    fontWeight: 'bold'

  }
  return (
    <div className="h-[4rem] relative w-11/12 rounded-2xl m-4 border-2 border-opacity-60 border-white">
      <div className="flex  justify-center items-center" style={fillerStyles} >
        <span className="text-3xl absolute top-1rem right-[22rem]" style={labelStyles}>Level {level}</span>
      </div>
    </div>
  );
};
const Scoure = ({ userInfo, acheivments, level }: any) => {
  return (
    <div className="flex flex-col items-center gap-[4rem]">
      <div className="flex flex-col w-full items-center gap-[3rem] bg-black bg-opacity-40 rounded-3xl p-8">
        <div className="flex  items-center justify-around w-full">
          <img
            className="h-[15rem] border-4 border-pink-600 w-[15rem] rounded-full cursor-pointer hover:scale-[1.1] hover:duration-[0.2s]"
            src={userInfo.avatar}
          />
          <div className="flex flex-col gap-[2rem]">
            <h1 className="text-5xl uppercase text-white">
              {userInfo.fullname}
            </h1>
            <h1 className="text-3xl uppercase">@ {userInfo.username}</h1>
          </div>
        </div>
        {/* <LevelBar currentScore={50} maxScore={100} /> */}
        <ProgressBar bgColor={"#008000"} level={level} />
      </div>
      <div className="flex-1 w-full bg-black bg-opacity-40 rounded-3xl flex items-center justify-center">
        <ImageSlider images={acheivments} />
        <ImageSlider images={acheivments} />
      </div>
    </div>
  );
};

const MatchHistory = ({
  avatar,
  username,
  userScore,
  OpunentScore,
  win,
  xp,
}: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={()=>navigate(`/profile/${username}`)} 
      className={`${win ? "bg-green-600" : "bg-red-600" } bg-opacity-25 rounded-xl flex items-center  p-2 pl-4 pr-4 hover:bg-slate-500 hover:duration-[0.2s] cursor-pointer`}>
      <div className="flex items-center gap-[1rem] text-white font-bol ">
        <img className="h-[4rem] w-[4rem] rounded-full" src={avatar} />
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
      <div className="flex flex-col justify-center items-center font-bold flex-1">
        <h1 className={`${win ? "text-green-600" : "text-red-600"} text-3xl`}>{`${win ? "Victory" : "Defeat"} `}</h1>
        <span className="text-2xl">{OpunentScore} _ {userScore}</span>
      </div>
      <h1 className="text-3xl ">{xp} EXP</h1>
    </div>
  );
};

const FriendsList = ({ username, avatar, status }: any) => {
  return (
    <li className="h-[15rem]  relative w-[12rem] border-2 flex flex-col border-opacity-20 hover:duration-[0.2s] border-white rounded-xl overflow-hidden cursor-pointer hover:scale-110 ">
      <img className="flex-1" src={avatar} alt="" />
      <div className="h-[4rem] flex items-center justify-center gap-4 ">
        {
          <div
            className={`${
              status === "ONLINE" ? "bg-green-400" : "bg-red-500"
            } pl-4 top-[12rem] z-50 h-[1rem] w-[1rem] rounded-full`}
          ></div>
        }
        <h1 className="uppercase  text-2xl font-bold text-white text-ellipsis overflow-hidden">
          {username}
        </h1>
      </div>
    </li>
  );
};
interface Profile {
  username: string;
  avatar: string;
  fullname: string;
}
interface Friends {
  username: string;
  avatar: string;
  status: string;
}

function Profile() {
  const [openMatch, setOpenMatch] = React.useState(true);
  const [ProfileInfo, setProfileInfo] = useState<Profile>({
    username: "",
    avatar: "",
    fullname: "",
  });
  const [acheivments, setAcheivments] = useState([]);
  const [Friends, setFriends] = useState<Friends[]>([]);
  const [FriendsIsopen, setFriendsIsopen] = useState(false);
  const [History, setHistory] = useState([]);
  const [level, setLevel] = useState(0);
  const userName = useParams();
  const navigate = useNavigate();
  const {userInfo}:any = useContext(LoginInfo);
  if (userName.username === undefined || userName.username === "me"){
    userName.username = userInfo.username;
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3000/profile/${userName.username}`,
          { withCredentials: true }
        );
        setProfileInfo((previous) => ({
          ...previous,
          username: response.data.username,
          avatar: response.data.avatar,
          fullname: response.data.fullname,
        }));
        console.log("==================", response.data);
        setFriends(response.data.friends);
        setAcheivments(response.data.achievements);
        setHistory(response.data.MatchHistory);
        setLevel(response.data.level);
      } catch (error) {
        navigate("/404");
      }
    };
    fetchProfile();
    console.log(userName);
  }, [userName]);

  return (
    <div className="ml-auto mr-auto mt-4 text-white text-opacity-50  border-[1px] border-green-600 w-140 h-[70rem] overflow-hidden bg-white backdrop-blur-md bg-opacity-5 rounded-[2rem] flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-[6rem]  w-full p-[5rem] h-full">
        <Scoure userInfo={ProfileInfo} acheivments={acheivments} level={level}/>
        <div className="grid-2 bg-black bg-opacity-40 rounded-3xl pl-8 pr-8 pt-5 overflow-auto">
          <nav className="flex gap-[3rem] text-3xl text-white font-bold">
            <button
              className="hover:bg-white hover:text-black rounded-3xl pl-2 pr-2 hover:duration-[0.2s]"
              onClick={() => {
                setOpenMatch(true);
                setFriendsIsopen(false);
              }}
            >
              Match History
            </button>
            <div className="border-[0.5px] h-[4rem]"></div>
            <button
              className="hover:bg-white hover:text-black rounded-3xl pl-2 pr-2 hover:duration-[0.2s]"
              onClick={() => {
                setOpenMatch(false);
                setFriendsIsopen(true);
              }}
            >
              Friends
            </button>
          </nav>
          <main className="mt-[2rem]">
            {openMatch && (
              <div className="flex flex-col text-white gap-[0.7rem]">
                {History.map((user) => (
                  <MatchHistory username={user.opponentUser} avatar={user.opponentAvatar} userScore={user.userScore} OpunentScore={user.opponentScore} xp={user.xpGain} win={user.win}/>
                ))}
              </div>
            )}
            {FriendsIsopen && (
              <ul className="flex flex-wrap overflow-hidden">
                {Friends.map((user) => (
                  <FriendsList
                    username={user.username}
                    avatar={user.avatar}
                    status={user.status}
                  />
                ))}
              </ul>
            )}
            <div className="text-8xl text-white"></div>
          </main>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
