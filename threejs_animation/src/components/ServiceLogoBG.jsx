'use client';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ServiceLogoBG() {
    const { scene: bgScene } = useGLTF('/models/background.glb');
    const bgRef = useRef();

    const mouse = useRef({ x: 0, y: 0 });

    const scroll = useRef(0);

    useEffect(() => {
        if (!bgScene) return;
        bgScene.traverse(child => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = false;
                child.material.opacity = 1;
                child.material.emissive = new THREE.Color(0xab76e2);
                child.material.emissiveIntensity = 1;
                child.renderOrder = -1; // Background lower order
            }
        });
    }, [bgScene]);

    useEffect(() => {
        const handleMouseMove = e => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse.current.x = x;
            mouse.current.y = y;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            scroll.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (!bgRef.current) return;

        bgRef.current.rotation.x = THREE.MathUtils.lerp(
            bgRef.current.rotation.x,
            mouse.current.y * 0.3,
            0.05
        );
        bgRef.current.rotation.y = THREE.MathUtils.lerp(
            bgRef.current.rotation.y,
            mouse.current.x * 0.3,
            0.05
        );

        // const zScroll = THREE.MathUtils.lerp(0, -1, scroll.current);
        // bgRef.current.position.z = zScroll;
    });

    return (
        <>
            <primitive
                ref={bgRef}
                object={bgScene}
                scale={[0.1, 0.1, 0.1]}
                position={[-3, 0, -3]}
                rotation={[0, 0, 0]}
            />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                <circleGeometry args={[5, 64]} />
                <meshStandardMaterial
                    color={'#220044'}
                    transparent
                    opacity={0.1}
                    emissive={'#7722ff'}
                    emissiveIntensity={1}
                />
            </mesh>
        </>
    );
}
