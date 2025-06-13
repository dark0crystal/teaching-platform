'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

function AudioReactiveCube({ analyser }: { analyser: AnalyserNode | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
    }
  }, [analyser]);

  useFrame(() => {
    if (!analyser || !dataArray.current || !meshRef.current) return;

    analyser.getByteFrequencyData(dataArray.current);
    const average = dataArray.current.reduce((a, b) => a + b, 0) / dataArray.current.length;

    const scale = 1 + average / 256;

    gsap.to(meshRef.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.2,
      ease: 'power1.out',
    });
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

export default function AudioVisualizerCube() {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !videoRef.current) return;

    const url = URL.createObjectURL(file);
    videoRef.current.src = url;

    const context = new AudioContext();
    const source = context.createMediaElementSource(videoRef.current);
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;

    source.connect(analyserNode);
    analyserNode.connect(context.destination);

    setAnalyser(analyserNode);
  };

  return (
    <div className="p-6">
      {/* File input on top */}
      <div className="mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="block border border-gray-300 rounded p-2 cursor-pointer"
        />
      </div>

      {/* Two-column layout: video left, cube right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Video section (left) */}
        <video
          ref={videoRef}
          controls
          className="w-full max-w-lg aspect-video border rounded shadow"
          onPlay={() => {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') ctx.resume();
          }}
        />

        {/* 3D Cube section (right) */}
        <div className="w-full h-[400px] max-w-2xl">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 3, 3]} />
              <AudioReactiveCube analyser={analyser} />
              <OrbitControls />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
