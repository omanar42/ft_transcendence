import { useEffect, useRef, useCallback } from "react";
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

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isUpPressed = useRef(false);
  const isDownPressed = useRef(false);
  const paddleSpeed = 5;
  const gameState = useRef<GameState>({
    user: { x: 0, y: 0, width: 0, height: 0, color: "", score: 0 },
    enemy: { x: 0, y: 0, width: 0, height: 0, color: "", score: 0 },
    net: { x: 0, y: 0, width: 0, height: 0, color: "" },
    ball: {
      x: 0,
      y: 0,
      radius: 0,
      speed: 0,
      velocityX: 0,
      velocityY: 0,
      color: "",
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      gameState.current = {
        user: {
          x: 4,
          y: canvas.height / 2 - 100 / 2,
          width: 16,
          height: 128,
          color: "#41a5fc",
          score: 0,
        },
        enemy: {
          x: canvas.width - 5 - 16,
          y: canvas.height / 2 - 100 / 2,
          width: 16,
          height: 128,
          color: "#f600d4",
          score: 0,
        },
        net: {
          x: canvas.width / 2 - 2,
          y: 0,
          width: 4,
          height: 16,
          color: "#6574cd",
        },
        ball: {
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 16,
          speed: 6,
          velocityX: 5,
          velocityY: 5,
          color: "#6574cd",
        },
      };

      const drawNet = () => {
        for (let i = 0; i <= ctx.canvas.height; i += 24) {
          drawRect(
            gameState.current.net.x,
            gameState.current.net.y + i,
            gameState.current.net.width,
            gameState.current.net.height,
            gameState.current.net.color
          );
        }
      };

      const drawRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        color: string
      ) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      };

      const drawPlayer = (player: Player) => {
        drawRect(player.x, player.y, player.width, player.height, player.color);
      };

      const drawCircle = (x: number, y: number, r: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      };

      const draw = () => {
        drawRect(0, 0, canvas.width, canvas.height, "black");
        drawNet();
        drawPlayer(gameState.current.user);
        drawPlayer(gameState.current.enemy);
        drawCircle(
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

        return (
          pLeft < bRight && pTop < bBottom && pRight > bLeft && pBottom > bTop
        );
      };

      const resetBall = () => {
        gameState.current.ball.x = canvas.width / 2;
        gameState.current.ball.y = canvas.height / 2;
        gameState.current.ball.speed = 5;
        gameState.current.ball.velocityX = -gameState.current.ball.velocityX;
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

        gameState.current.ball.x += gameState.current.ball.velocityX;
        gameState.current.ball.y += gameState.current.ball.velocityY;

        if (
          gameState.current.ball.y + gameState.current.ball.radius >=
            canvas.height ||
          gameState.current.ball.y - gameState.current.ball.radius <= 0
        ) {
          gameState.current.ball.velocityY = -gameState.current.ball.velocityY;
        }

        let computerLevel = 0.05;
        gameState.current.enemy.y +=
          (gameState.current.ball.y -
            (gameState.current.enemy.y + gameState.current.enemy.height / 2)) *
          computerLevel;

        // gameState.current.user.y += (gameState.current.ball.y - (gameState.current.user.y + gameState.current.user.height / 2)) * computerLevel;

        let player =
          gameState.current.ball.x < canvas.width / 2
            ? gameState.current.user
            : gameState.current.enemy;
        if (collision(gameState.current.ball, player)) {
          let collidePoint =
            gameState.current.ball.y - (player.y + player.height / 2);
          collidePoint = collidePoint / (player.height / 2);
          let angleRad = (Math.PI / 4) * collidePoint;
          let direction = gameState.current.ball.x < canvas.width / 2 ? 1 : -1;
          gameState.current.ball.velocityX =
            direction * gameState.current.ball.speed * Math.cos(angleRad);
          gameState.current.ball.velocityY =
            gameState.current.ball.speed * Math.sin(angleRad);
          gameState.current.ball.speed += 0.1;
        }

        if (gameState.current.ball.x - gameState.current.ball.radius < 0) {
          gameState.current.enemy.score++;
          resetBall();
        } else if (
          gameState.current.ball.x + gameState.current.ball.radius >
          canvas.width
        ) {
          gameState.current.user.score++;
          resetBall();
        }
      };

      const render = () => {
        update();
        draw();
        requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [handleKeyDown, handleKeyUp]);

  // On the client-side, listen for 'gameStateUpdate' and render the new state
  // socket.on('gameStateUpdate', (gameState) => {
  //   // Update the game rendering based on the new game state
  // });

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
