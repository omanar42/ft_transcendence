import { useEffect, useRef, useCallback, useContext, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import "./Game.css";
import Friend from "./Assets/Friend.jpg";
import Random from "./Assets/random.jpg";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../../assets/avatar.jpeg";
import ReactCardFlip from "react-card-flip";
import Background_1 from "../../../../public/Modes/black.jpg";
import Background_2 from "../../../../public/Modes/kimetsu.jpg";
import { ToastContainer, toast } from "react-toastify";

interface Player {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;
}

interface Net {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
}

interface GameState {
  user: Player;
  opponent: Player;
  net: Net;
  ball: Ball;
}

const Game = ({ setGameMode, imageUrl }: any) => {
  const { userInfo, gamesocket }: any = useContext(LoginInfo);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isUpPressed = useRef(false);
  const isDownPressed = useRef(false);
  const paddleSpeed = 8;
  const [status, setStatus] = useState("waiting");
  const [roomId, setRoomId] = useState("");
  const gameState = useRef<GameState>({
    user: {
      id: 0,
      x: 4,
      y: 700 / 2 - 100 / 2,
      width: 16,
      height: 128,
      color: "#41a5fc",
      score: 0,
    },
    opponent: {
      x: 1300 - 5 - 16,
      y: 700 / 2 - 100 / 2,
      width: 16,
      height: 128,
      color: "#f600d4",
      score: 0,
    },
    net: {
      x: 1300 / 2 - 2,
      y: 0,
      width: 4,
      height: 16,
      color: "#6574cd",
    },
    ball: {
      x: 1300 / 2,
      y: 700 / 2,
      radius: 16,
      speed: 6,
      color: "#6574cd",
    },
  });
  const [userScore, setUserScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [win, setwin] = useState(false);
  useEffect(() => {
    if (gamesocket) {
      gamesocket.on("start", handleStart);
      gamesocket.on("gameState", handleGameState);
      gamesocket.on("gameOver", handleGameOver);

      return () => {
        gamesocket.off("start", handleStart);
        gamesocket.off("gameState", handleGameState);
        gamesocket.off("gameOver", handleGameOver);
      };
    }
  }, [gamesocket]);

  const handleGameOver = (data: any) => {
    console.log("game over");
    console.log(data);
    if (data.winner === userInfo.username) {
      setwin(true);
    } else {
      setwin(false);
    }
    setStatus("gameOver");
    // setGameMode(null);
  };

  const handleStart = (data: any) => {
    console.log("----------------dkhaal----------------");
    setStatus(data.status);
    setRoomId(data.roomId);
  };

  const handleGameState = (gameStateUpdate: any) => {
    gameState.current.ball.x = gameStateUpdate.ball.x;
    gameState.current.ball.y = gameStateUpdate.ball.y;
    if (userInfo.username === gameStateUpdate.playerOne.username) {
      gameState.current.user.id = gameStateUpdate.playerOne.num;
      gameState.current.opponent.y = gameStateUpdate.playerTwo.y;
      if (
        gameStateUpdate.playerOne.score !== gameState.current.user.score ||
        gameStateUpdate.playerTwo.score !== gameState.current.opponent.score
      ) {
        gameState.current.user.score = gameStateUpdate.playerOne.score;
        gameState.current.opponent.score = gameStateUpdate.playerTwo.score;
        setUserScore(gameStateUpdate.playerOne.score);
        setOpponentScore(gameStateUpdate.playerTwo.score);
        gameState.current.user.y = 700 / 2 - 100 / 2;
      }
    } else {
      gameState.current.user.id = gameStateUpdate.playerTwo.num;
      gameState.current.opponent.y = gameStateUpdate.playerOne.y;
      if (
        gameStateUpdate.playerOne.score !== gameState.current.opponent.score ||
        gameStateUpdate.playerTwo.score !== gameState.current.user.score
      ) {
        gameState.current.opponent.score = gameStateUpdate.playerOne.score;
        gameState.current.user.score = gameStateUpdate.playerTwo.score;
        setUserScore(gameStateUpdate.playerOne.score);
        setOpponentScore(gameStateUpdate.playerTwo.score);
        gameState.current.user.y = 700 / 2 - 100 / 2;
      }
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      isUpPressed.current = true;
    } else if (e.key === "ArrowDown") {
      isDownPressed.current = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      isUpPressed.current = false;
    } else if (e.key === "ArrowDown") {
      isDownPressed.current = false;
    }
  }, []);

  const drawNet = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i <= ctx.canvas.height; i += 24) {
      drawRect(
        ctx,
        gameState.current.net.x,
        gameState.current.net.y + i,
        gameState.current.net.width,
        gameState.current.net.height,
        gameState.current.net.color
      );
    }
  };

  const drawRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
    drawRoundedRect(
      ctx,
      player.x,
      player.y,
      player.width,
      player.height,
      10,
      player.color
    );
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string,
    num: number
  ) => {
    const canvasMidPoint = 1300 / 2;
    if (num === 2) x = canvasMidPoint - (x - canvasMidPoint);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  };

  const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.font = "75px orbitron";
    ctx.fillText(text, x, y);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (imageUrl) {
      let img = new Image();
      img.src = imageUrl;
      ctx.drawImage(img, 0, 0, 1300, 700);
    }
    drawNet(ctx);
    drawPlayer(ctx, gameState.current.user);
    drawPlayer(ctx, gameState.current.opponent);
    drawCircle(
      ctx,
      gameState.current.ball.x,
      gameState.current.ball.y,
      gameState.current.ball.radius,
      gameState.current.ball.color,
      gameState.current.user.id
    );
    const canvasMidPoint = 1300 / 2;
    const userScore = gameState.current.user.score;
    const opponentScore = gameState.current.opponent.score;
    drawText(ctx, userScore.toString(), canvasMidPoint - 190, 100, "#fff");
    drawText(ctx, opponentScore.toString(), canvasMidPoint + 100, 100, "#fff");
  };

  const update = () => {
    console.log(status);
    if (isUpPressed.current) {
      gameState.current.user.y = Math.max(
        0,
        gameState.current.user.y - paddleSpeed
      );
    }
    if (isDownPressed.current) {
      const canvasHeight = canvasRef.current?.height || 0;
      gameState.current.user.y = Math.min(
        canvasHeight - gameState.current.user.height,
        gameState.current.user.y + paddleSpeed
      );
    }
    const dataToSend = {
      roomId: roomId,
      position: gameState.current.user.y,
    };
    gamesocket?.emit("paddlePosition", dataToSend);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    // if (ctx && canvas && status === "gameOver") {
    //   drawText(ctx, "Game Over", 1300 / 2 - 200, 700 / 2, "#fff");
    //   return () => {};
    // }

    if (ctx && canvas && status !== "start") {
      drawText(ctx, "Waiting for opponent...", 1300 / 2 - 300, 700 / 2, "#fff");
    }

    if (ctx && canvas && status === "start") {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      const render = () => {
        update();
        draw(ctx);
        requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }

    return () => {};
  }, [handleKeyDown, handleKeyUp, status]);

  return (
    <>
      {status === "gameOver" ? (

        <button className="playButton w-[20rem] h-[20rem] z-20 bg-pink-600 " onClick={() => setGameMode(null)}>
          Back to Menu
        </button>
      ) : (
        <div className="w-[75%] flex flex-col gap-1 justify-center">
          {status === "start" && (
            <div className="b800 bg-white bg-opacity-[10%] backdrop-blur-sm flex items-center justify-between p-4 rounded-xl">
              <div className="flex-1 flex gap-[2rem] items-center text-white ">
                <img
                  src={avatar}
                  className="w-[6rem] h-[6rem] border-2 border-pink-600  rounded-full"
                />
                <h1 className="text-4xl font-extrabold">Simo</h1>
              </div>
              <div className="flex-1 flex items-center  text-white font-bold justify-between">
                <span className="text-6xl">{userScore}</span>
                <h1 className="text-8xl">VS</h1>
                <span className="text-6xl">{opponentScore}</span>
              </div>
              <div className="flex-1 flex gap-[2rem] items-center justify-end text-white ">
                <h1 className="text-4xl font-extrabold">Simo</h1>
                <img
                  src={avatar}
                  className="w-[6rem] h-[6rem] border-2 border-pink-600  rounded-full"
                />
              </div>
            </div>
          )}
          <canvas
            className="canvasStyle"
            width="1300"
            height="700"
            ref={canvasRef}
          ></canvas>
        </div>
      )}
    </>
  );
};

const images = [Background_1, Background_2];
const StartGame = ({setImageUrl}:any) => {
  const { gamesocket, setGameMode }: any = useContext(LoginInfo);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userName, setUserName] = useState("");
  const [level, setLevel] = useState("Easy");
  const [isFlipped_1, setIsFlipped_1] = useState(false);

  const handlePlayRandom = () => {
    setGameMode("random");
    gamesocket?.emit("addToRoom");
  };

  const handlePlayWithFriend = (username: string) => {
    setGameMode("friend");
    const dataToSend = {
      friend: username,
      status: "request",
      level: level,
    };
    gamesocket?.emit("PlayWithFriend", dataToSend);
  };

  const startGame = () => {
    if (userName === "") {
      toast.error("Please enter a username");
      return;
    }
    handlePlayWithFriend(userName);
  };

  const selectImage = (image: any) => {
    setImageUrl(image);
    handlePlayRandom();
  };

  return (
    <div className="flex justify-around w-[130rem] ml-auto mr-auto">
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
      <div className="flex flex-col items-center gap-[2rem]">
        <h1 className="text-5xl text-white">Play With Friend</h1>
        <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
          <img
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer rounded-[4rem]  hover:opacity-75 hover:duration-[0.4s] h-[50rem] w-[45rem]"
            src={Friend}
            alt="friend"
          />
          <div className="cursor-pointer relative text-white rounded-[4rem] flex-col flex items-center justify-around  h-[50rem] w-[45rem] bg-dark">
            {/* <div className="modal rounded-[4rem]"></div> */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute text-8xl text-pink-600 top-[1rem] left-[2rem]"
            >
              &times;
            </button>
            <h1 className="text-5xl text-white">Username</h1>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-[70%] h-[4rem] pl-4  font-bold text-3xl bg-dark-300"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              className="h-[4rem] w-[60%] rounded-2xl bg-dark-300 outline-none pl-4 text-4xl text-white"
              placeholder="Enter a username..."
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              onClick={startGame}
              className="text-4xl p-4 bg-pink-600 rounded-3xl"
            >
              Confirm
            </button>
          </div>
        </ReactCardFlip>
      </div>
      <div className="flex flex-col items-center gap-[2rem]">
        <h1 className="text-5xl text-white">Play Random</h1>
        <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped_1}>
          <img
            onClick={()=>setIsFlipped_1(true)}
            className="cursor-pointer rounded-[4rem]  hover:opacity-75 hover:duration-[0.4s]  h-[50rem] w-[45rem]"
            src={Random}
            alt="random"
          />
          <div className="cursor-pointer overflow-hidden relative text-white rounded-[4rem] flex-col flex items-center justify-around  h-[50rem] w-[45rem] bg-dark">
            <div className="w-full h-full flex flex-col justify-between gap-1">
              {images.map((image) => (
                <img
                  onClick={() => selectImage(image)}
                  className="h-full w-full hover:opacity-50 hover:duration-[0.2s] border-white border-opacity-20"
                  src={image}
                />
              ))}
            </div>
          </div>
        </ReactCardFlip>
      </div>
    </div>
  );
};
function LadingPage() {
  const { gameMode, setGameMode }: any = useContext(LoginInfo);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0" }}
        exit={{ y: "100%" }}
        className="h-screen flex justify-center items-center"
      >
        {!gameMode ? <StartGame setImageUrl={setImageUrl} /> : <Game setGameMode={setGameMode} imageUrl={imageUrl}/>}
      </motion.div>
    </AnimatePresence>
  );
}

export default LadingPage;
