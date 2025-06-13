'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    // GSAP infinite rotation animation
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 5,
      repeat: -1,
      ease: 'power1.inOut'
    });

    // Bounce scale animation
    gsap.to(meshRef.current.scale, {
      y: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Cube() {
  return (
    <div className="min-h-[60rem] w-full">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 3, 3]} />
          <RotatingBox />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
