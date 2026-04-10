"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────
const CANVAS_W = 400;
const CANVAS_H = 600;
const GRAVITY = 0.45;
const JUMP_FORCE = -7.5;
const TERMINAL_VELOCITY = 10;
const PIPE_SPEED = 2.8;
const PIPE_WIDTH = 52;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 110; // frames between pipe spawns
const BIRD_SIZE = 18;
const BIRD_X = 80;
const GROUND_H = 50;

// ─── TYPES ───────────────────────────────────────────────────
interface Pipe {
  x: number;
  topH: number;
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

// ─── COMPONENT ───────────────────────────────────────────────
export default function CyberGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{
    bird: { y: number; vel: number; rotation: number };
    pipes: Pipe[];
    particles: Particle[];
    frame: number;
    score: number;
    highScore: number;
    state: "idle" | "playing" | "dead";
    deadTimer: number;
    shakeTimer: number;
    groundScroll: number;
    flashAlpha: number;
  }>({
    bird: { y: CANVAS_H / 2, vel: 0, rotation: 0 },
    pipes: [],
    particles: [],
    frame: 0,
    score: 0,
    highScore: 0,
    state: "idle",
    deadTimer: 0,
    shakeTimer: 0,
    groundScroll: 0,
    flashAlpha: 0,
  });

  const [displayScore, setDisplayScore] = useState(0);
  const [displayHigh, setDisplayHigh] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");

  // ─── SPAWN HELPERS ─────────────────────────────────────────
  const spawnPipe = useCallback(() => {
    const g = gameRef.current;
    const minTop = 60;
    const maxTop = CANVAS_H - GROUND_H - PIPE_GAP - 60;
    const topH = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    g.pipes.push({ x: CANVAS_W + 10, topH, passed: false });
  }, []);

  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    const g = gameRef.current;
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.4,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  // ─── ACTIONS ───────────────────────────────────────────────
  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle") {
      g.state = "playing";
      setGameState("playing");
      g.bird.y = CANVAS_H / 2;
      g.bird.vel = JUMP_FORCE;
      g.pipes = [];
      g.particles = [];
      g.frame = 0;
      g.score = 0;
      g.flashAlpha = 0;
      setDisplayScore(0);
    } else if (g.state === "playing") {
      g.bird.vel = JUMP_FORCE;
      spawnParticles(BIRD_X, g.bird.y, 4);
    } else if (g.state === "dead") {
      if (g.deadTimer <= 0) {
        g.state = "idle";
        setGameState("idle");
      }
    }
  }, [spawnParticles]);

  const die = useCallback(() => {
    const g = gameRef.current;
    if (g.state !== "playing") return;
    g.state = "dead";
    setGameState("dead");
    g.deadTimer = 45; // ~0.75s lockout before restart
    g.shakeTimer = 12;
    g.flashAlpha = 1;
    if (g.score > g.highScore) {
      g.highScore = g.score;
      setDisplayHigh(g.score);
    }
    spawnParticles(BIRD_X, g.bird.y, 20);
  }, [spawnParticles]);

  // ─── GAME LOOP ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const tick = () => {
      const g = gameRef.current;
      const { bird, pipes, particles } = g;

      // ── UPDATE ──────────────────────────────────────────
      if (g.state === "playing") {
        g.frame++;

        // Bird physics
        bird.vel += GRAVITY;
        if (bird.vel > TERMINAL_VELOCITY) bird.vel = TERMINAL_VELOCITY;
        bird.y += bird.vel;
        bird.rotation = Math.min(Math.PI / 3, Math.max(-Math.PI / 4, bird.vel * 0.08));

        // Pipe spawning
        if (g.frame % PIPE_INTERVAL === 0) spawnPipe();

        // Pipe movement & collision
        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= PIPE_SPEED;

          // Score
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X) {
            p.passed = true;
            g.score++;
            setDisplayScore(g.score);
            spawnParticles(BIRD_X + BIRD_SIZE, bird.y, 6);
          }

          // Collision detection (with slight hitbox forgiveness)
          const margin = 3;
          if (
            BIRD_X + BIRD_SIZE - margin > p.x &&
            BIRD_X + margin < p.x + PIPE_WIDTH
          ) {
            if (bird.y - BIRD_SIZE / 2 + margin < p.topH || bird.y + BIRD_SIZE / 2 - margin > p.topH + PIPE_GAP) {
              die();
            }
          }

          // Cleanup
          if (p.x + PIPE_WIDTH < -10) pipes.splice(i, 1);
        }

        // Ground / ceiling collision
        if (bird.y + BIRD_SIZE / 2 >= CANVAS_H - GROUND_H || bird.y - BIRD_SIZE / 2 <= 0) {
          die();
        }

        // Ground scroll
        g.groundScroll = (g.groundScroll + PIPE_SPEED) % 20;
      }

      // Idle bob
      if (g.state === "idle") {
        bird.y = CANVAS_H / 2 + Math.sin(Date.now() * 0.004) * 8;
        bird.rotation = 0;
        g.groundScroll = (g.groundScroll + 1) % 20;
      }

      // Dead timer
      if (g.state === "dead") {
        g.deadTimer = Math.max(0, g.deadTimer - 1);
        bird.vel += GRAVITY;
        if (bird.vel > TERMINAL_VELOCITY) bird.vel = TERMINAL_VELOCITY;
        bird.y += bird.vel;
        bird.rotation = Math.min(Math.PI / 2, bird.rotation + 0.1);
        if (bird.y + BIRD_SIZE / 2 > CANVAS_H - GROUND_H) {
          bird.y = CANVAS_H - GROUND_H - BIRD_SIZE / 2;
          bird.vel = 0;
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1 / 60 / pt.maxLife;
        if (pt.life <= 0) particles.splice(i, 1);
      }

      // Shake decay
      if (g.shakeTimer > 0) g.shakeTimer--;
      // Flash decay
      if (g.flashAlpha > 0) g.flashAlpha = Math.max(0, g.flashAlpha - 0.06);

      // ── DRAW ────────────────────────────────────────────
      ctx.save();

      // Screen shake
      if (g.shakeTimer > 0) {
        const intensity = g.shakeTimer * 0.8;
        ctx.translate(
          (Math.random() - 0.5) * intensity,
          (Math.random() - 0.5) * intensity
        );
      }

      // Background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_W, y);
        ctx.stroke();
      }

      // ── PIPES ─────────────────────────────────────────
      pipes.forEach((p) => {
        // Top pipe
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topH);
        // Top pipe cap
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(p.x - 3, p.topH - 6, PIPE_WIDTH + 6, 6);

        // Bottom pipe
        const bottomY = p.topH + PIPE_GAP;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, bottomY, PIPE_WIDTH, CANVAS_H - bottomY - GROUND_H);
        // Bottom pipe cap
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(p.x - 3, bottomY, PIPE_WIDTH + 6, 6);

        // Inner shadow on pipes for depth
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(p.x + 4, 0, PIPE_WIDTH - 8, p.topH - 6);
        ctx.fillRect(p.x + 4, bottomY + 6, PIPE_WIDTH - 8, CANVAS_H - bottomY - GROUND_H - 6);
      });

      // ── GROUND ────────────────────────────────────────
      const groundY = CANVAS_H - GROUND_H;
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, groundY, CANVAS_W, GROUND_H);
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(0, groundY, CANVAS_W, 3);
      // Ground hash marks
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let x = -g.groundScroll; x < CANVAS_W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 10);
        ctx.lineTo(x + 10, groundY + GROUND_H);
        ctx.stroke();
      }

      // ── PARTICLES ─────────────────────────────────────
      particles.forEach((pt) => {
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      ctx.globalAlpha = 1;

      // ── BIRD ──────────────────────────────────────────
      ctx.save();
      ctx.translate(BIRD_X, bird.y);
      ctx.rotate(bird.rotation);

      // Glow
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#00ffcc";
      // Body
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      ctx.shadowBlur = 0;
      // Inner core
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-BIRD_SIZE / 2 + 4, -BIRD_SIZE / 2 + 4, BIRD_SIZE - 8, BIRD_SIZE - 8);
      // Eye
      ctx.fillStyle = "#050505";
      ctx.fillRect(BIRD_SIZE / 2 - 6, -BIRD_SIZE / 2 + 3, 4, 4);

      ctx.restore();

      // ── TRAIL (when playing) ──────────────────────────
      if (g.state === "playing") {
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "#00ffcc";
        for (let i = 1; i <= 5; i++) {
          const trailX = BIRD_X - i * 6;
          const trailSize = BIRD_SIZE - i * 2;
          if (trailSize > 0) {
            ctx.fillRect(trailX - trailSize / 2, bird.y - trailSize / 2, trailSize, trailSize);
          }
        }
        ctx.globalAlpha = 1;
      }

      // ── SCORE (in-canvas) ─────────────────────────────
      if (g.state === "playing" || g.state === "dead") {
        ctx.font = "bold 48px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillText(String(g.score), CANVAS_W / 2, 80);
      }

      // ── DEATH FLASH ───────────────────────────────────
      if (g.flashAlpha > 0) {
        ctx.globalAlpha = g.flashAlpha;
        ctx.fillStyle = "#ff0040";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.globalAlpha = 1;
      }

      // ── SCANLINES (permanent overlay) ─────────────────
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = 0; y < CANVAS_H; y += 4) {
        ctx.fillRect(0, y, CANVAS_W, 2);
      }

      ctx.restore();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spawnPipe, spawnParticles, die]);

  // ─── INPUT HANDLING ────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      jump();
    },
    [jump]
  );

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      className="w-full relative select-none overflow-hidden cursor-crosshair bg-[#020202] group border border-white/20 font-mono touch-none"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white/30 pointer-events-none z-30" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white/30 pointer-events-none z-30" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white/30 pointer-events-none z-30" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white/30 pointer-events-none z-30" />

      {/* HUD — Top Left */}
      <div className="absolute top-4 left-4 z-30 text-[9px] uppercase tracking-[0.25em] text-white/60 pointer-events-none">
        <div className="font-bold text-white/90">FLIGHT.SIM // AYORINDE</div>
        <div className="mt-0.5 text-white/30">SYS.STATUS: {gameState === "dead" ? "REBOOT READY" : "ONLINE"}</div>
      </div>

      {/* HUD — Score */}
      <div className="absolute top-4 right-4 z-30 text-right pointer-events-none">
        <div className="text-[#00ffcc] text-3xl font-bold tabular-nums">{displayScore}</div>
        <div className="text-[8px] uppercase tracking-[0.3em] text-white/40 mt-0.5">HIGH: {displayHigh}</div>
      </div>

      {/* HUD — Bottom */}
      <div className="absolute bottom-3 left-4 z-30 text-[7px] uppercase tracking-[0.2em] text-white/30 pointer-events-none hidden sm:flex gap-6">
        <span>INPUT: SPACE / CLICK / TAP</span>
        <span>FPS: 60</span>
      </div>

      {/* IDLE OVERLAY */}
      {gameState === "idle" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none bg-black/50 backdrop-blur-[1px]">
          <div className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-3">FLIGHT SIMULATOR v1.0</div>
          <div className="text-3xl text-white font-bold tracking-[0.15em] mb-1">SYSTEM READY</div>
          <div className="text-[#00ffcc] text-[10px] tracking-[0.4em] font-bold mt-4 animate-pulse border border-[#00ffcc]/50 px-4 py-2">
            TAP TO INITIATE
          </div>
        </div>
      )}

      {/* DEAD OVERLAY */}
      {gameState === "dead" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-white/80 text-2xl font-bold tracking-[0.2em] animate-pulse">
            SYSTEM CRASH
          </div>
          <div className="text-[9px] uppercase tracking-[0.4em] text-white/40 mt-2">
            TAP TO REBOOT
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="w-full flex items-center justify-center py-4 md:py-8">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full max-w-[400px] h-auto aspect-[400/600] block"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
