import { useEffect, useRef, useCallback, useContext, useState } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import "./Game.css";

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
  enemy: Player;
  net: Net;
  ball: Ball;
}

// const emitPaddlePosition = (paddlePosition) => {
//   gameSocket.emit('paddlePosition', paddlePosition);
// };
const Game = () => {
  const { userInfo, gamesocket }: any = useContext(LoginInfo);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isUpPressed = useRef(false);
  const isDownPressed = useRef(false);
  const paddleSpeed = 5;
  const [status, setStatus] = useState("waiting");
  const [roomId, setRoomId] = useState("");
  const gameState = useRef<GameState>({
    user: {
      x: 4,
      y: 700 / 2 - 100 / 2,
      width: 16,
      height: 128,
      color: "#41a5fc",
      score: 0,
    },
    enemy: {
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
      velocityX: 5,
      velocityY: 5,
      color: "#6574cd",
    },
  });

  gamesocket?.emit("addToRoom");

  useEffect(() => {
    if (gamesocket) {
      gamesocket.on("start", handleStart);
      gamesocket.on("gameState", handleGameState);

      return () => {
        gamesocket.off("start", handleStart);
        gamesocket.off("gameState", handleGameState);
      };
    }
  }, [gamesocket]);

  const handleStart = (data: any) => {
    console.log("game started");
    setStatus(data.status);
    setRoomId(data.roomId);
  };

  const handleGameState = (gameStateUpdate: any) => {
    console.log("game state updated");
    gameState.current.ball.x = gameStateUpdate.ball.x;
    gameState.current.ball.y = gameStateUpdate.ball.y;
    gameState.current.ball.velocityX = gameStateUpdate.ball.velocityX;
    gameState.current.ball.velocityY = gameStateUpdate.ball.velocityY;
    // gameState.current.user.score = gameStateUpdate.playerOne.score;
    // gameState.current.enemy.score = gameStateUpdate.playerTwo.score;
    // gameState.current.enemy.y = gameStateUpdate.playerTwo.y;
    if (userInfo.username === gameStateUpdate.playerOne.username) {
      gameState.current.user.score = gameStateUpdate.playerOne.score;
      gameState.current.enemy.score = gameStateUpdate.playerTwo.score;
      gameState.current.enemy.y = gameStateUpdate.playerTwo.y;
    } else {
      gameState.current.user.score = gameStateUpdate.playerTwo.score;
      gameState.current.enemy.score = gameStateUpdate.playerOne.score;
      gameState.current.enemy.y = gameStateUpdate.playerOne.y;
    }
    console.log(gameStateUpdate);
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

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
    drawRect(
      ctx,
      player.x,
      player.y,
      player.width,
      player.height,
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

  const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, "#000");
    drawNet(ctx);
    drawPlayer(ctx, gameState.current.user);
    drawPlayer(ctx, gameState.current.enemy);
    drawCircle(
      ctx,
      gameState.current.ball.x,
      gameState.current.ball.y,
      gameState.current.ball.radius,
      gameState.current.ball.color
    );
  };

  const update = () => {
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
    // gamesocket.off("paddlePosition");
    // gamesocket?.on("paddlePosition");
    gamesocket?.emit("paddlePosition", dataToSend);
    // console.log(dataToSend);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (status != "start") {
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
  }, [handleKeyDown, handleKeyUp, status]);

  return (
    <div className="h-screen flex justify-center items-center">
      <canvas
        className="game"
        width="1300"
        height="700"
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default Game;
