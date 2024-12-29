import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui'; 
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const App = () => {
  const sceneRef = useRef(null); 
  const [rotationSpeed, setRotationSpeed] = useState(0.1); 

  useEffect(() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement); 

    
    const ambientLight = new THREE.AmbientLight(0x404040, 1); 
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); 
    pointLight.position.set(2, 2, 2); 
    scene.add(ambientLight, pointLight); 

    
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/textures/lilienstein_4k.exr', (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = hdrTexture; 
      scene.environment = hdrTexture; 
    });

    
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.7, 
      roughness: 0.2, 
    });

    
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
    sphere.position.x = -1.5;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material);
    torus.position.x = 1.5;

    
    scene.add(sphere, plane, torus);

    
    const clock = new THREE.Clock();

    
    const gui = new GUI();
    const params = {
      metalness: material.metalness, 
      roughness: material.roughness, 
      speed: rotationSpeed, 
    };

    
    gui.add(params, 'metalness', 0, 1).onChange((value) => {
      material.metalness = value; 
    });
    gui.add(params, 'roughness', 0, 1).onChange((value) => {
      material.roughness = value; 
    });
    gui.add(params, 'speed', 0, 1).onChange((value) => {
      setRotationSpeed(value); 
    });

    
    camera.position.z = 3;

    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      
      sphere.rotation.y = rotationSpeed * elapsedTime;
      plane.rotation.y = rotationSpeed * elapsedTime;
      torus.rotation.y = rotationSpeed * elapsedTime;
      sphere.rotation.x = rotationSpeed * 0.5 * elapsedTime;
      plane.rotation.x = rotationSpeed * 0.5 * elapsedTime;
      torus.rotation.x = rotationSpeed * 0.5 * elapsedTime;

      renderer.render(scene, camera); 

      requestAnimationFrame(animate); 
    };

    animate();

   
    return () => {
      gui.destroy();
      renderer.dispose();
    };
  }, [rotationSpeed]); 

  return (
    <div ref={sceneRef} style={{ width: '100vw', height: '100vh' }}>
      
    </div>
  );
};

export default App;