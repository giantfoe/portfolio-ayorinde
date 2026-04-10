"use client";

import { useEffect, useRef, useState } from "react";

export default function CyberGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Core game structures inside a local coordinate matrix (800x500)
    const bird = { x: 100, y: 250, width: 20, height: 20, velocity: 0, gravity: 0.4, jump: -7 };
    const pipes: { x: number, y: number, width: number, gap: number, passed: boolean }[] = [];
    let frame = 0;
    let currentScore = 0;
    let isGameOver = false;

    const spawnPipe = () => {
      const gap = 130; // Challenge gap
      const minHeight = 50;
      const maxHeight = canvas.height - gap - minHeight;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      
      pipes.push({
        x: canvas.width,
        y: height,
        width: 60,
        gap: gap,
        passed: false
      });
    };

    const resetGame = () => {
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      pipes.length = 0;
      frame = 0;
      currentScore = 0;
      setScore(0);
      isGameOver = false;
      setGameOver(false);
      setGameStarted(true);
    };

    const triggerGameOver = () => {
      if (isGameOver) return; // Prevent double trigger
      isGameOver = true;
      setGameOver(true);
      setHighScore(prev => Math.max(prev, currentScore));
    };

    const update = () => {
      if (isGameOver) return;
      frame++;

      // Bird physics: Terminal velocity cap and gravity
      bird.velocity += bird.gravity;
      // Cap falling speed
      if (bird.velocity > 12) bird.velocity = 12;
      bird.y += bird.velocity;

      // Floor / Ceiling collision
      if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        triggerGameOver();
      }

      // Pipe generation timing
      if (frame % 100 === 0) {
        spawnPipe();
      }

      // Pipe updates & bounding box collision mapping
      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 3.5; // game speed

        // Collision logic
        if (
          bird.x < p.x + p.width &&
          bird.x + bird.width > p.x &&
          (bird.y < p.y || bird.y + bird.height > p.y + p.gap)
        ) {
          triggerGameOver();
        }

        // Score logic
        if (p.x + p.width < bird.x && !p.passed) {
          p.passed = true;
          currentScore += 1;
          setScore(currentScore);
        }

        // Garbage collect offscreen pipes
        if (p.x + p.width < 0) {
          pipes.splice(i, 1);
        }
      }
    };

    const draw = () => {
      // Clear matrix
      ctx.fillStyle = "#020202";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid / Cyberpunk wireframes background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const offset = (frame * 1.5) % 40;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i - offset, 0);
        ctx.lineTo(i - offset, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Firewall Pipes
      pipes.forEach(p => {
        // Outer boundaries White
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, 0, p.width, p.y);
        ctx.fillRect(p.x, p.y + p.gap, p.width, canvas.height - p.y - p.gap);
        
        // Inner edge energy beams Cyan
        ctx.fillStyle = "rgba(0, 255, 204, 0.8)";
        ctx.fillRect(p.x, p.y - 6, p.width, 6);
        ctx.fillRect(p.x, p.y + p.gap, p.width, 6);
      });

      // Draw Drone (Bird)
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 0.1))));
      
      // Core Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ffcc";
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
      ctx.shadowBlur = 0;
      
      // Core Matrix Plate
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-bird.width / 2 + 4, -bird.height / 2 + 4, bird.width - 8, bird.height - 8);
      ctx.restore();
    };

    const loop = () => {
      // Allow initial idle animation drawing
      if (!gameStarted && !isGameOver) {
        draw();
      } else {
        update();
        draw();
      }

      if (!isGameOver || gameOver) {
         animationId = requestAnimationFrame(loop);
      }
    };

    // Begin looping
    animationId = requestAnimationFrame(loop);

    const handleInput = (e: Event) => {
      e.preventDefault();
      if (!gameStarted || isGameOver) {
        resetGame();
      } else {
        bird.velocity = bird.jump;
      }
    };

    canvas.addEventListener("mousedown", handleInput);
    canvas.addEventListener("touchstart", handleInput);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") handleInput(e as unknown as Event);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousedown", handleInput);
      canvas.removeEventListener("touchstart", handleInput);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="w-full relative select-none overflow-hidden cursor-crosshair bg-[#020202] group h-[60vh] md:h-[80vh] border border-white/20 p-2 font-mono flex flex-col items-center justify-center">
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none z-10"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none z-10"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none z-10"></div>

      {/* HUD Info */}
      <div className="absolute top-6 left-6 z-10 text-[10px] uppercase tracking-widest text-white opacity-80 pointer-events-none transition-opacity">
        <div className="font-bold">FLIGHT.SIMULATOR // [EXECUTE]</div>
        <div className="text-white/40 mt-1 uppercase tracking-[0.3em]">SYS.STATUS: {gameOver ? 'CRITICAL FAILURE' : 'ONLINE'}</div>
        <div className="text-[#00ffcc] mt-4 font-bold text-4xl">{score}</div>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute bottom-6 left-6 z-10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 pointer-events-none flex gap-8">
         <div className="text-white">HIGH SCORE: {highScore}</div>
         <div className="hidden md:block">INPUT: SPACE / CLICK</div>
      </div>

      {/* Start / Reboot Screen */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
          <h2 className="text-4xl text-white font-bold tracking-widest mb-4">
            {gameOver ? "SYSTEM CRASH" : "SYSTEM READY"}
          </h2>
          <p className="text-[#00ffcc] text-xs md:text-sm tracking-[0.3em] animate-pulse font-bold bg-black/50 px-4 py-2 border border-[#00ffcc]">
            CLICK OR PRESS SPACE TO {gameOver ? "REBOOT" : "INITIATE"}
          </p>
        </div>
      )}

      {/* 2D Canvas Engine */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        className="w-full h-full object-contain md:object-cover z-0 opacity-80"
      />
        
      {/* VHS / Scanline Effects Overlay */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30 z-20"></div>
    </div>
  );
}
