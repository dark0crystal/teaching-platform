"use client"
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
export default function Test() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const frameRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Load GLB model
    const loadModel = async () => {
      try {
        // Import GLTFLoader dynamically since it's not in the core Three.js
        const { GLTFLoader } = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js');
        
        const loader = new GLTFLoader();
        
        loader.load(
          '../../../../public/treeproject.glb', // Replace with your GLB file name
          (gltf) => {
            const model = gltf.scene;
            
            // Scale and position the model as needed
            model.scale.setScalar(1);
            model.position.set(0, 0, 0);
            
            // Enable shadows for the model
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            modelRef.current = model;
            scene.add(model);
            setLoading(false);
          },
          (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
          },
          (error) => {
            console.error('Error loading model:', error);
            setError('Failed to load 3D model');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error importing GLTFLoader:', err);
        setError('Failed to load GLTFLoader');
        setLoading(false);
      }
    };

    loadModel();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add point light for more dynamic lighting
    const pointLight = new THREE.PointLight(0xff6b6b, 0.5, 10);
    pointLight.position.set(-3, 0, 3);
    scene.add(pointLight);

    // Create a ground plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Animation function
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (modelRef.current) {
        // Rotate the model slowly
        modelRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (modelRef.current) {
        modelRef.current.rotation.y = mouseX * 0.5;
        modelRef.current.rotation.x = mouseY * 0.3;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-bold mb-2">3D Model Viewer</h1>
        {loading && <p className="text-sm opacity-75">Loading model...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && <p className="text-sm opacity-75">Move your mouse to interact with the model</p>}
      </div>
      
      <div className="absolute bottom-4 right-4 text-white text-xs opacity-50 z-10">
        <p>Built with Three.js & Next.js</p>
      </div>
    </div>
  );
}