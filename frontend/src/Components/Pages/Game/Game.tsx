import { useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Game.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket"]
});

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let gameData = {};

    socket.emit("joinGame", {
      username: "test",
      room: "test",
    });

    socket.on('hello-client')

    if (ctx && canvas) {
      const user = {
        x: 5,
        y: canvas.height / 2 - 100 / 2,
        width: 16,
        height: 128,
        color: "#41a5fc",
        score: 0,
      };

      const enemy = {
        x: canvas.width - 5 - 16,
        y: canvas.height / 2 - 100 / 2,
        width: 16,
        height: 128,
        color: "#f600d4",
        score: 0,
      };

      const net = {
        x: canvas.width / 2 - 2,
        y: 0,
        width: 4,
        height: 16,
        color: "#6574cd",
      };

      const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 16,
        speed: 5,
        velocityX: 5,
        velocityY: 5,
        color: "#6574cd",
      };

      // socket.on("gameState", (data) => {
      //   // Assuming gameState has properties like user, enemy, and ball
      //   // Update your game objects here
      //   gameData = data;
      //   // ... similarly for enemy and ball
      // });

      const drawNet = () => {
        for (let i = 0; i <= ctx.canvas.height; i += 24) {
          drawRect(net.x, net.y + i, net.width, net.height, net.color);
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

      const drawPlayer = (playerData) => {
        drawRect(
          playerData.x,
          playerData.y,
          playerData.width,
          playerData.height,
          playerData.color
        );
      };

      const drawCircle = (x: number, y: number, r: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      };

      const draw = () => {
        // let user = gameData.self;
        // let enemy = gameData.opponent;
        drawRect(0, 0, canvas.width, canvas.height, "black");
        drawNet();
        drawPlayer(user);
        drawPlayer(enemy);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
      };

      const render = () => {
        draw();
        requestAnimationFrame(render);
      };

      render();

      // return () => {
      //   socket.off("gameState");
      // };
    }
  }, []);

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
