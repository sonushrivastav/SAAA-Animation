'use client';
import { MeshTransmissionMaterial, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

function FloatingGlass({
    color = '#ffffff',
    envMapIntensity = 1,
    speed = 1,
    amplitude = 0.05,
    rotationSpeed = 0.002,
    motionVariant = 0,
    mouseInfluence = false,
}) {
    const ref = useRef();
    const { nodes } = useGLTF('/models/new3.glb');
    const hdrTexture = useLoader(RGBELoader, '/images/empty_warehouse_01_2k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    const mouse = useRef({ x: 0, y: 0 });

    // Optional mouse movement effect
    useEffect(() => {
        if (!mouseInfluence) return;

        const handleMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseInfluence]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed;

        // Each variant has a unique motion path
        switch (motionVariant) {
            case 0:
                ref.current.rotation.y += rotationSpeed;
                ref.current.position.x = Math.sin(t) * amplitude;
                ref.current.position.y = Math.cos(t * 0.8) * amplitude * 0.8;
                break;
            case 1:
                ref.current.rotation.y -= rotationSpeed * 0.7;
                ref.current.position.x = Math.cos(t * 1.2) * amplitude * 1.2;
                ref.current.position.y = Math.sin(t * 0.7) * amplitude * 0.9;
                break;
            case 2:
                ref.current.rotation.x += rotationSpeed * 1.5;
                ref.current.position.x = Math.sin(t * 0.6) * amplitude;
                ref.current.position.y = Math.cos(t * 1.4) * amplitude;
                break;
            case 3:
                ref.current.rotation.y += rotationSpeed * 0.5;
                ref.current.rotation.x -= rotationSpeed * 0.2;
                ref.current.position.x = Math.cos(t * 0.9) * amplitude * 0.7;
                ref.current.position.y = Math.sin(t * 1.1) * amplitude;
                break;
        }

        // Apply slight mouse influence if enabled
        if (mouseInfluence) {
            ref.current.position.x += mouse.current.x * 0.05;
            ref.current.position.y += mouse.current.y * 0.05;
        }
    });

    return (
        <mesh
            ref={ref}
            geometry={nodes.Text002.geometry}
            scale={[2, 2, 2]}
            rotation={[Math.PI / 2, Math.PI, 0.1]}
        >
            <MeshTransmissionMaterial
                roughness={0.1}
                color={color}
                transmission={1}
                thickness={0.2}
                envMap={hdrTexture}
                transparent={true}
            />
        </mesh>
    );
}

export default function ThreeGlass({
    color = '#844DE9',
    speed = 1,
    amplitude = 0.05,
    rotationSpeed = 0.002,
    motionVariant = 0,
    mouseInfluence = false,
}) {
    return (
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 1], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={2} color={'#ffffff'} />
            <spotLight position={[-5, 5, 3]} intensity={1.5} color={'#c8a8ff'} />

            <FloatingGlass
                color={color}
                speed={speed}
                amplitude={amplitude}
                rotationSpeed={rotationSpeed}
                motionVariant={motionVariant}
                mouseInfluence={mouseInfluence}
            />

            <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
    );
}
