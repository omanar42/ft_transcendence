import { useEffect, useRef, useCallback, useContext, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import "./Game.css";
import Friend from "./Assets/Friend.png";
import Random from "./Assets/random.png";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../../assets/avatar.jpeg";
import ReactCardFlip from "react-card-flip";

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

const Game = ({ setGameMode }: any) => {
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
      alert("You won!");
    } else {
      alert("You lost!");
    }
    setStatus("gameOver");
    setGameMode(null);
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
        <button className="playButton" onClick={() => setGameMode(null)}>
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

const StartGame = ({ handlePlayRandom, handlePlayWithFriend }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="flex justify-around w-[130rem] ml-auto mr-auto">
      <div className="flex flex-col items-center gap-[2rem]">
        <h1 className="text-5xl text-white">Play With Friend</h1>
        <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
            <img
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer rounded-[4rem]  hover:opacity-75 hover:duration-[0.4s] h-[50rem] w-[42rem]"
              src={Friend}
              alt="friend"
            />
            
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer rounded-[4rem]  hover:opacity-75 hover:duration-[0.4s] h-[50rem] w-[42rem] bg-dark"
          ></div>
        </ReactCardFlip>
      </div>
      <div className="flex flex-col items-center gap-[2rem]">
        <h1 className="text-5xl text-white">Play Random</h1>
        <img
          onClick={handlePlayRandom}
          className="cursor-pointer rounded-[4rem]  hover:opacity-75 hover:duration-[0.4s]"
          src={Random}
          alt="random"
        />
      </div>
    </div>
  );
};
function LadingPage() {
  const { gamesocket, gameMode, setGameMode }: any = useContext(LoginInfo);
  const [friendUsername, setFriendUsername] = useState("");
  const [prompt, setPrompt] = useState(false);

  // useEffect(() => {
  //   if (gamesocket) {
  //     gamesocket.on("invitation", handleInvitation);

  //     return () => {
  //       gamesocket.off("invitation", handleInvitation);
  //     };
  //   }
  // }, [gamesocket]);

  // const handleInvitation = (data: any) => {
  //   console.log(`jat invitation ahbibi ara chi boussa `)
  //   setGameMode('friend');
  //   const dataToSend = {
  //     roomId: data.roomId,
  //     status: 'accept'
  //   };
  //   gamesocket?.emit("PlayWithFriend", dataToSend);
  // };

  const handlePlayRandom = () => {
    setGameMode("random");
    gamesocket?.emit("addToRoom");
  };

  const handlePlayWithFriend = (username: string) => {
    setGameMode("friend");
    const dataToSend = {
      friend: username,
      status: "request",
    };
    gamesocket?.emit("PlayWithFriend", dataToSend);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0" }}
        exit={{ y: "100%" }}
        className="h-screen flex justify-center items-center"
      >
        {!gameMode ? (
          // <div>
          //   <button className="playButton" onClick={() => setPrompt(true)}>
          //     Play Random
          //   </button>
          //   {prompt && (
          //     <div>
          //       <button className="playButton" onClick={() => handlePlayRandom()}>
          //         Confirm
          //       </button>
          //       <button className="playButton" onClick={() => setPrompt(false)}>
          //         Cancel
          //       </button>
          //     </div>
          //   )}
          //   <div>
          //     <input
          //       type="text"
          //       placeholder="Friend's username"
          //       value={friendUsername}
          //       onChange={(e) => setFriendUsername(e.target.value)}
          //       className="usernameInput"
          //     />
          //     <button
          //       className="playButton"
          //       onClick={() => handlePlayWithFriend(friendUsername)}
          //     >
          //       Play with Friend
          //     </button>
          //   </div>
          // </div>
          <StartGame handlePlayRandom={handlePlayRandom} />
        ) : (
          <Game setGameMode={setGameMode} />
        )}
        {/* <StartGame /> */}
      </motion.div>
    </AnimatePresence>
  );
}

export default LadingPage;
