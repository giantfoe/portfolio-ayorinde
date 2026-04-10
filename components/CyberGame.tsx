"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Obstacles() {
  const boxCount = 150;
  const boxes = useMemo(() => {
    return Array.from({ length: boxCount }).map(() => ({
      position: [
        (Math.random() - 0.5) * 60, // x
        (Math.random() - 0.5) * 40, // y
        -Math.random() * 400 - 50,  // z (distance)
      ],
      speed: Math.random() * 1.5 + 0.5,
      rotationSpeed: [Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.05],
    }));
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = new THREE.Object3D();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Animate obstacles flying towards camera
    boxes.forEach((box, i) => {
      box.position[2] += box.speed * delta * 60; 
      
      // Reset if it flies past the camera
      if (box.position[2] > 10) {
        box.position[2] = -400;
        box.position[0] = (Math.random() - 0.5) * 60;
        box.position[1] = (Math.random() - 0.5) * 40;
      }

      dummy.position.set(box.position[0], box.position[1], box.position[2]);
      
      // Rotate boxes
      dummy.rotation.x += box.rotationSpeed[0];
      dummy.rotation.y += box.rotationSpeed[1];
      dummy.rotation.z += box.rotationSpeed[2];
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, boxCount]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.6} />
    </instancedMesh>
  );
}

function Player() {
  const playerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    // Map pointer coords (-1 to 1) to actual world size based on viewport
    const viewportX = state.pointer.x * (state.viewport.width / 2);
    const viewportY = state.pointer.y * (state.viewport.height / 2);
    
    // Smooth LERP (Linear Interpolation) to make the ship feel fluid/drifty
    playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, viewportX, 0.15);
    playerRef.current.position.y = THREE.MathUtils.lerp(playerRef.current.position.y, viewportY, 0.15);
    
    // Bank the ship based on position
    playerRef.current.rotation.z = -state.pointer.x * 0.8;
    playerRef.current.rotation.x = state.pointer.y * 0.5;
  });

  return (
    <mesh ref={playerRef} position={[0, 0, 5]}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshBasicMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

function GridTunnel() {
  const gridBottomRef = useRef<THREE.GridHelper>(null!);
  const gridTopRef = useRef<THREE.GridHelper>(null!);
  
  useFrame((state, delta) => {
    const speed = delta * 20;
    if (gridBottomRef.current) {
      gridBottomRef.current.position.z += speed;
      if (gridBottomRef.current.position.z > 20) gridBottomRef.current.position.z = 0;
    }
    if (gridTopRef.current) {
      gridTopRef.current.position.z += speed;
      if (gridTopRef.current.position.z > 20) gridTopRef.current.position.z = 0;
    }
  });

  return (
    <group>
      <gridHelper ref={gridBottomRef} args={[100, 40, "#ffffff", "rgba(255,255,255,0.05)"]} position={[0, -10, -50]} />
      <gridHelper ref={gridTopRef} args={[100, 40, "#ffffff", "rgba(255,255,255,0.05)"]} position={[0, 10, -50]} />
    </group>
  );
}

export default function CyberGame() {
  return (
    <div className="w-full relative select-none overflow-hidden cursor-crosshair bg-black group h-[60vh] md:h-[80vh] border border-white/20 p-2">
      
      {/* HUD Info */}
      <div className="absolute top-6 left-6 z-10 font-mono text-[10px] uppercase tracking-widest text-white opacity-80 pointer-events-none transition-opacity">
        <div className="font-bold">SYS.BREACH.SIMULATOR // [EXECUTE]</div>
        <div className="text-white/40 mt-1 uppercase tracking-[0.3em]">Calibrate input variables</div>
        <div className="text-[#00ffcc] mt-4 animate-pulse">Use cursor to navigate target matrix</div>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute bottom-6 left-6 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-white/50 pointer-events-none flex gap-8">
         <div>LIFESUPPORT: ONLINE</div>
         <div>RADAR: ENGAGED</div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-10 font-mono text-[8px] uppercase tracking-[0.2em] text-white/50 pointer-events-none">
         V 1.0.0.9
      </div>

      {/* Target Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-10 opacity-30 flex items-center justify-center">
         <div className="w-1 h-3 bg-white absolute top-[-10px]"></div>
         <div className="w-1 h-3 bg-white absolute bottom-[-10px]"></div>
         <div className="w-3 h-1 bg-white absolute left-[-10px]"></div>
         <div className="w-3 h-1 bg-white absolute right-[-10px]"></div>
         <div className="w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
      </div>

      <div className="w-full h-full relative overflow-hidden bg-[#020202]">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} className="w-full h-full">
          {/* Fog for depth fading */}
          <fog attach="fog" args={["#020202", 10, 150]} />
          
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          
          <GridTunnel />
          <Obstacles />
          <Player />
        </Canvas>
        
        {/* VHS / Scanline Effects Overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30 z-20"></div>
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:10px_10px] opacity-40 z-20"></div>
      </div>
    </div>
  );
}
