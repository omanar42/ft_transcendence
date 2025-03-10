import { useEffect, useRef, useCallback, useContext, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import ai from "../../../assets/ai.png";
import "./Game.css";
import victory from "./Assets/victory.png";
import defeat from "./Assets/defeat.png";

interface Player {
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
  velocityX: number;
  velocityY: number;
  color: string;
}

interface GameState {
  user: Player;
  ai: Player;
  net: Net;
  ball: Ball;
}

const GameAI = ({ imageUrl }: any) => {
  const { userInfo, setGameMode }: any = useContext(LoginInfo);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isUpPressed = useRef(false);
  const isDownPressed = useRef(false);
  const paddleSpeed = 8;
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setaiScore] = useState<number>(0);
  const [gameEnd, setGameEnd] = useState<boolean>(false);
  const [win, setwin] = useState(false);
  const gameState = useRef<GameState>({
    user: {
      x: 4,
      y: 700 / 2 - 100 / 2,
      width: 16,
      height: 128,
      color: "#41a5fc",
      score: 0,
    },
    ai: {
      x: 1300 - 5 - 16,
      y: 700 / 2 - 100 / 2,
      width: 16,
      height: 128,
      color: "#f600d4",
      score: 0,
    },
    net: { x: 1300 / 2 - 2, y: 0, width: 4, height: 16, color: "#6574cd" },
    ball: {
      x: 1300 / 2,
      y: 700 / 2,
      radius: 16,
      speed: 10,
      velocityX: 10,
      velocityY: 4,
      color: "#6574cd",
    },
  });

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
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 1300, 700);
    if (imageUrl) {
      let img = new Image();
      img.src = imageUrl;
      ctx.drawImage(img, 0, 0, 1300, 700);
    }
    drawNet(ctx);
    drawPlayer(ctx, gameState.current.user);
    drawPlayer(ctx, gameState.current.ai);
    drawCircle(
      ctx,
      gameState.current.ball.x,
      gameState.current.ball.y,
      gameState.current.ball.radius,
      gameState.current.ball.color
    );
  };

  const collision = (b: Ball, p: Player) => {
    const pTop = p.y;
    const pBottom = p.y + p.height;
    const pLeft = p.x;
    const pRight = p.x + p.width;

    const bTop = b.y - b.radius;
    const bBottom = b.y + b.radius;
    const bLeft = b.x - b.radius;
    const bRight = b.x + b.radius;

    return pLeft < bRight && pTop < bBottom && pRight > bLeft && pBottom > bTop;
  };

  const resetBall = (canvas: HTMLCanvasElement) => {
    gameState.current.ball.x = canvas.width / 2;
    gameState.current.ball.y = canvas.height / 2;
    gameState.current.ball.velocityX = -gameState.current.ball.velocityX;
    gameState.current.ball.velocityY = 4;
  };

  const resetGame = (canvas: HTMLCanvasElement) => {
    gameState.current.user.score = 0;
    gameState.current.ai.score = 0;
    setUserScore(0);
    setaiScore(0);
    resetBall(canvas);
  };

  const update = (canvas: HTMLCanvasElement) => {
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

    gameState.current.ball.x += gameState.current.ball.velocityX;
    gameState.current.ball.y += gameState.current.ball.velocityY;

    if (gameState.current.ball.y + gameState.current.ball.radius >= canvas.height) {
      gameState.current.ball.velocityY = -gameState.current.ball.velocityY;
      gameState.current.ball.y = canvas.height - gameState.current.ball.radius;
    } else if (gameState.current.ball.y - gameState.current.ball.radius <= 0) {
      gameState.current.ball.velocityY = -gameState.current.ball.velocityY;
      gameState.current.ball.y = gameState.current.ball.radius;
    }

    let aiLevel = 0.05;
    gameState.current.ai.y +=
      (gameState.current.ball.y -
        (gameState.current.ai.y + gameState.current.ai.height / 2)) *
      aiLevel;
    if (gameState.current.ai.y <= 0) gameState.current.ai.y = 0;
    if (gameState.current.ai.y >= canvas.height - gameState.current.ai.height)
      gameState.current.ai.y = canvas.height - gameState.current.ai.height;
    
    let player =
      gameState.current.ball.x < canvas.width / 2
        ? gameState.current.user
        : gameState.current.ai;
    if (collision(gameState.current.ball, player)) {
      let collidePoint =
        gameState.current.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2) - 0.5;
      let angleRad = (Math.PI / 5) * collidePoint;
      let direction = gameState.current.ball.x < canvas.width / 2 ? 1 : -1;
      gameState.current.ball.velocityX =
        direction * gameState.current.ball.speed * Math.cos(angleRad);
      gameState.current.ball.velocityY =
        gameState.current.ball.speed * Math.sin(angleRad);
    }

    if (gameState.current.ball.x - gameState.current.ball.radius <= 0) {
      gameState.current.ai.score++;
      setaiScore(gameState.current.ai.score);
      resetBall(canvas);
    } else if (
      gameState.current.ball.x + gameState.current.ball.radius >=
      canvas.width
    ) {
      gameState.current.user.score++;
      setUserScore(gameState.current.user.score);
      resetBall(canvas);
    }
      
    if (
      gameState.current.ai.score === 11 ||
      gameState.current.user.score === 11
    ) {
      if (gameState.current.ai.score === 11) {
        setwin(false);
      } else {
        setwin(true);
      }
      setGameEnd(true);
      resetGame(canvas);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animationFrameId: number;

    const stopAnimation = () => {
      cancelAnimationFrame(animationFrameId);
    };

    if (ctx && canvas) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      const render = () => {
        update(canvas);
        draw(ctx);
        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        stopAnimation();
      };
    }
  }, [handleKeyDown, handleKeyUp, gameEnd]);

  return (
    <>
      {gameEnd ? (
        <div className="flex flex-col items-center gap-[2rem]">
        <img className="rounded-[5rem] hover:opacity-75 hover:duration-[0.4s] w-[80rem]"
        src={win ? victory : defeat} />
        <div className="flex mt-[3rem] justify-center w-full text-3xl font-bold">
          <button
            className="bg-blue-400 text-white pb-3 pt-1 pl-2 pr-2 rounded-xl hover:bg-white hover:text-black hover:duration-[0.2s]"
            onClick={() => setGameMode(null)}
            >
            Back to Menu
          </button>
        </div>
      </div>
      ) : (
        <div className="w-[75%] flex flex-col gap-1 justify-center">
          <div className="b800 bg-white bg-opacity-[10%] backdrop-blur-sm flex items-center justify-between p-4 rounded-xl">
            <div className="flex-1 flex gap-[2rem] items-center text-white ">
              <img
                src={userInfo.avatar}
                className="w-[2rem] h-[2rem] md:w-[4rem] md:h-[4rem] lg:w-[6rem] lg:h-[6rem] border-2 border-pink-600  rounded-full"
              />
              <h1 className="text-[0.7rem] md:text-[1.5rem] lg:text-[2rem] font-extrabold text-blue-400">
                {userInfo.username}
              </h1>
            </div>
            <div className="w-[6rem] md:w-[8rem] flex-1 flex items-center text-white font-bold justify-between">
              <span className="w-[1rem] md:text-[2rem] text-blue-400">{userScore}</span>
              <h1 className="w-[1rem] md:text-[2rem] text-violet-400">VS</h1>
              <span className="w-[1rem] md:text-[2rem] text-pink-600">{aiScore}</span>
            </div>
            <div className="flex-1 flex gap-[2rem] items-center justify-end text-white ">
              <h1 className="text-[0.7rem] md:text-[1.5rem] lg:text-[2rem] font-extrabold text-pink-600">
                CyberPonk
              </h1>
              <img src={ai} className="w-[2rem] h-[2rem] md:w-[4rem] md:h-[4rem] lg:w-[6rem] lg:h-[6rem]" />
            </div>
          </div>
          <canvas
            className="canvasStyle"
            width="1300"
            height="700"
            ref={canvasRef}
          ></canvas>
          <div className="flex mt-[3rem] justify-center w-full text-3xl font-bold">
            <button
              className="bg-blue-400 text-white pb-3 pt-1 pl-2 pr-2 rounded-xl hover:bg-white hover:text-black hover:duration-[0.2s]"
              onClick={() => setGameMode(null)}
            >
              Back to menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameAI;
