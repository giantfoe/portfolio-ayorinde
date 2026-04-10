"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CyberGame() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.015);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x020202, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Obstacles
    const boxCount = 150;
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.6 
    });
    
    // InstancedMesh for performance
    const instancedMesh = new THREE.InstancedMesh(geometry, material, boxCount);
    scene.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const boxesData = Array.from({ length: boxCount }).map(() => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        -Math.random() * 400 - 50,
      ],
      speed: Math.random() * 1.5 + 0.5,
      rotationSpeed: [Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.05],
    }));

    // Player Object
    const playerGeo = new THREE.OctahedronGeometry(0.8, 0);
    const playerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const playerMesh = new THREE.Mesh(playerGeo, playerMat);
    playerMesh.position.z = 5;
    scene.add(playerMesh);

    // Grids
    const gridBottom = new THREE.GridHelper(100, 40, 0xffffff, 0x111111);
    gridBottom.position.set(0, -10, -50);
    scene.add(gridBottom);

    const gridTop = new THREE.GridHelper(100, 40, 0xffffff, 0x111111);
    gridTop.position.set(0, 10, -50);
    scene.add(gridTop);

    // Mouse Tracking
    const pointer = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalize bounds from -1 to +1
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Viewport projection limits
      const mapX = pointer.x * 20; // 20 units world space half-width
      const mapY = pointer.y * 15;

      // Smooth follow player mapped to world space
      playerMesh.position.x += (mapX - playerMesh.position.x) * 0.15;
      playerMesh.position.y += (mapY - playerMesh.position.y) * 0.15;

      // Bank player ship
      playerMesh.rotation.z = -pointer.x * 0.8;
      playerMesh.rotation.x = pointer.y * 0.5;

      // Move Grid Tunnel
      gridBottom.position.z += delta * 20;
      if (gridBottom.position.z > 20) gridBottom.position.z = 0;
      gridTop.position.z += delta * 20;
      if (gridTop.position.z > 20) gridTop.position.z = 0;

      // Move Obstacles
      boxesData.forEach((box, i) => {
        box.position[2] += box.speed * delta * 60;
        if (box.position[2] > 10) {
          box.position[2] = -400;
          box.position[0] = (Math.random() - 0.5) * 60;
          box.position[1] = (Math.random() - 0.5) * 40;
        }

        dummy.position.set(box.position[0], box.position[1], box.position[2]);
        dummy.rotation.x += box.rotationSpeed[0];
        dummy.rotation.y += box.rotationSpeed[1];
        dummy.rotation.z += box.rotationSpeed[2];
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      });
      instancedMesh.instanceMatrix.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose materials/geometry to free up GPU handles
      geometry.dispose();
      material.dispose();
      playerGeo.dispose();
      playerMat.dispose();
    };
  }, []);

  return (
    <div className="w-full relative select-none overflow-hidden cursor-crosshair bg-[#020202] group h-[60vh] md:h-[80vh] border border-white/20 p-2">
      
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
         V 1.0.1.0
      </div>

      {/* Target Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none z-10 opacity-30 flex items-center justify-center">
         <div className="w-1 h-3 bg-white absolute top-[-10px]"></div>
         <div className="w-1 h-3 bg-white absolute bottom-[-10px]"></div>
         <div className="w-3 h-1 bg-white absolute left-[-10px]"></div>
         <div className="w-3 h-1 bg-white absolute right-[-10px]"></div>
         <div className="w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
      </div>

      {/* Vanilla ThreeJS Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 bg-[#020202]"></div>
        
      {/* VHS / Scanline Effects Overlay */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30 z-20"></div>
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:10px_10px] opacity-40 z-20"></div>
    </div>
  );
}
