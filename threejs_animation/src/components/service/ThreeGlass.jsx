'use client';
import { MeshTransmissionMaterial, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

function FloatingGlass({ color = '#ffffff', envMapIntensity = 1 }) {
    const ref = useRef();
    const { nodes, scene } = useGLTF('/models/new3.glb');
    console.log(scene);

    useFrame(({ clock }) => {
        // gentle float
        ref.current.rotation.y += 0.002;
        ref.current.position.x = Math.sin(clock.getElapsedTime()) * 0.05;
    });
    const hdrTexture = useLoader(RGBELoader, '/images/empty_warehouse_01_2k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    return (
        <mesh
            ref={ref}
            geometry={nodes.Text002.geometry}
            scale={[2, 2, 2]}
            position={[0, 0, 0]}
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

function BackgroundTexturePlane() {
    const texture = useLoader(THREE.TextureLoader, '/images/texture.jpg');

    return (
        <mesh position={[0, 0, -1]}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial map={texture} toneMapped={false} opacity={1} transparent />
        </mesh>
    );
}

export default function ThreeGlass() {
    return (
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 1], fov: 75 }}>
            {/* Lights */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={2} color={'#ffffff'} />
            <spotLight position={[-5, 5, 3]} intensity={1.5} color={'#c8a8ff'} />
            {/* <BackgroundTexturePlane /> */}
            <FloatingGlass color={'#844DE9'} />

            <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
    );
}
