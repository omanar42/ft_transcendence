import React from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
const History = [
  {
    avatar:
      "https://cdn.intra.42.fr/users/3fe187b98b948c31ae17b534ea656927/omanar.jpg",
    username: "omanar",
  },
  {
    avatar:
      "https://cdn.intra.42.fr/users/706afa441605e55226115a6b614145d2/omeslall.jpg",
    username: "omeslall",
  },
  {
    avatar:
      "https://cdn.intra.42.fr/users/e3821355391cc0c7d0978731afe7f585/hobenaba.JPG",
    username: "hobenaba",
  },
  {
    avatar:
      "https://cdn.intra.42.fr/users/6a531cbc0b00f0de3da69ab9b92951be/anlabchi.jpeg",
    username: "anlabchi",
  },
  {
    avatar:"https://cdn.intra.42.fr/users/5d3b5cd692fb000c68b0824d435c4ef4/hoakoumi.JPG",
    username:"hoakoumi"
  },
  {
    avatar:"https://cdn.intra.42.fr/users/4a4a69ca0ab2202fd3a3500c5ad40b88/achraiti.jpeg",
    username:"achraiti"
  },
  {
    avatar:"https://cdn.intra.42.fr/users/90afa6925ae367098a0e5ea463c24b31/nolahmar.JPG",
    username:"nolahmar"
  },
  {
    avatar:"https://cdn.intra.42.fr/users/a27acd192404aeb3bf7e76e0dd67cfd2/small_mezzine.jpeg",
    username:"small_mezzine"
  },
  {
    avatar: "https://cdn.intra.42.fr/users/4ff059069ef903c70d7cb000f3bad7e0/small_amaarifa.jpg",
    username: "small_amaarifa",
  },
  {
    avatar: "https://cdn.intra.42.fr/users/d0ac05e0e24c0d0a932a8c2ff83d833e/small_slouham.jpeg",
    username: "small_slouham",
  },
  {
    avatar: "https://cdn.intra.42.fr/users/f108b3d2ad145657c753cd4caad243cb/small_nben-ais.jpeg",
    username: "small_nben-ais",
  },
  {
    avatar:"https://cdn.intra.42.fr/users/a27acd192404aeb3bf7e76e0dd67cfd2/small_mezzine.jpeg",
    username:"small_mezzine"
  },
  {
    avatar: "https://cdn.intra.42.fr/users/4ff059069ef903c70d7cb000f3bad7e0/small_amaarifa.jpg",
    username: "small_amaarifa",
  },
  {
    avatar: "https://cdn.intra.42.fr/users/d0ac05e0e24c0d0a932a8c2ff83d833e/small_slouham.jpeg",
    username: "small_slouham",
  },
  {
    avatar: "https://cdn.intra.42.fr/users/f108b3d2ad145657c753cd4caad243cb/small_nben-ais.jpeg",
    username: "small_nben-ais",
  },
];

const LevelBar = ({ currentScore, maxScore }) => {
  const scorePercentage = Math.min((currentScore / maxScore) * 100, 100);

  return (
    <div className="w-[50rem] border-2 border-white border-opacity-20 rounded-full text-center ">
      <div
        className="bg-green-500 h-[3rem] text-2xl font-bold  text-c text-white p-1 leading-none rounded-full"
        style={{ width: `${scorePercentage}%` }}
      >
        {currentScore}/{maxScore}
      </div>
    </div>
  );
};

const Scoure = ({ userInfo }) => {
  return (
    <div className="flex flex-col items-center gap-[4rem]">
      <div className="flex flex-col w-full items-center gap-[3rem] bg-black bg-opacity-40 rounded-3xl p-8">
        <div className="flex  items-center justify-around w-full">
          <img
            className="h-[15rem] w-[15rem] rounded-full"
            src={userInfo.avatar}
          />
          <div className="flex flex-col gap-[2rem]">
            <h1 className="text-5xl uppercase text-white">
              {userInfo.fullname}
            </h1>
            <h1 className="text-3xl uppercase">@ {userInfo.username}</h1>
          </div>
        </div>
        <LevelBar currentScore={50} maxScore={100} />
      </div>
      <div className="flex-1 w-full bg-black bg-opacity-40 rounded-3xl"></div>
    </div>
  );
};

const MatchHistory = ({ avatar, username }) => {
  return (
    <div className="bg-white bg-opacity-25 rounded-xl flex items-center  p-2 pl-4 pr-4">
      <div className="flex items-center gap-[1rem] text-white font-bold flex-1">
        <img className="h-[4rem] w-[4rem] rounded-full" src={avatar} />
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
      <div className="flex flex-col justify-center items-center font-bold flex-1">
        <h1 className="text-red-700 text-3xl">Deafat</h1>
        <span className="text-2xl">2 _ 1</span>
      </div>
      <h1 className="flex-1 text-3xl">20 EXP</h1>
      <h1 className="text-3xl">{new Date().getDay()}</h1>
    </div>
  );
};

function Profile() {
  const { userInfo } = useContext(LoginInfo);
  const { username } = useParams();
  console.log(`' ${username} '`);
  return (
    <div className="ml-auto mr-auto mt-4 text-white text-opacity-50  border-[1px] border-green-600 w-140 h-[70rem] overflow-hidden bg-white backdrop-blur-md bg-opacity-5 rounded-[2rem] flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-[6rem]  w-full p-[5rem] h-full">
        <Scoure userInfo={userInfo} />
        <div className="grid-2 bg-black bg-opacity-40 rounded-3xl pl-8 pr-8 pt-5 overflow-auto">
          <nav className="flex gap-[3rem] text-3xl text-white font-bold">
            <button>Match History</button>
            <div className="border-[0.5px] h-[4rem]"></div>
            <button>Friends</button>
          </nav>
          <main className="mt-[2rem] overflow-auto">
            <div className="flex flex-col text-white gap-[0.7rem]">
              {History.map((user) => (
                <MatchHistory username={user.username} avatar={user.avatar} />
              ))}
            </div>
          </main>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
