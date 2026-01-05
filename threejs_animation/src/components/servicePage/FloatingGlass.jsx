
'use client';
import { Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';

// Pre-loading helps prevent the "jump" when a user scrolls to the section
// Replace these with your actual compressed model paths
// useGLTF.preload('/models/investor.glb');
// useGLTF.preload('/models/finance.glb');
// useGLTF.preload('/models/grow.glb');

function GlassModel({
    url,
    floating = true,
    speed = 1,
    amplitude = 0.05,
    motionVariant = 0,
    mouseInfluence = true,
}) {
    // Dynamic Preloader
    useEffect(() => {
        if (url) useGLTF.preload(url);
    }, [url]);

    // 1. Optimized Loading with Draco support
    // This uses a public CDN for the decoder so you don't have to host it

    const { scene: originalScene } = useGLTF(
        url,
        'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
    );

    // 2. Memoize the cloned scene to prevent memory leaks on re-render
    const scene = useMemo(() => {
        const clone = originalScene.clone();
        clone.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // child.material.transparent = true;
                // child.material.opacity = 0.9;
            }
        });
        return clone;
    }, [originalScene]);

    const ref = useRef();
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mouseInfluence) return;
        const handleMouseMove = e => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseInfluence]);

    useFrame(({ clock }) => {
        if (!ref.current) return;

        const t = clock.getElapsedTime() * speed;
        const mesh = ref.current;

        // Base floating logic
        switch (motionVariant) {
            case 0:
                mesh.position.x = Math.sin(t) * amplitude;
                mesh.position.y = Math.cos(t * 0.8) * amplitude * 0.8;
                break;

            case 1:
                mesh.position.x = Math.cos(t * 1.2) * amplitude * 1.2;
                mesh.position.y = Math.sin(t * 0.7) * amplitude * 0.9;
                break;

            case 2:
                mesh.position.x = Math.sin(t * 0.6) * amplitude;
                mesh.position.y = Math.cos(t * 1.4) * amplitude;
                break;

            case 3:
                mesh.position.x = Math.cos(t * 0.9) * amplitude * 0.7;
                mesh.position.y = Math.sin(t * 1.1) * amplitude;
                break;
        }

        // Mouse parallax
        if (mouseInfluence) {
            mesh.position.x += mouse.current.x * 0.05;
            mesh.position.y += mouse.current.y * 0.05;
        }
    });

    return (
        <group ref={ref} position={[0, 0, 0]} scale={[5.5, 5.5, 5.5]}>
            <primitive position={[0.08, -0.4, 0]} object={scene} />
        </group>
    );
}

function Loader() {
    return (
        <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#844de9" wireframe />
        </mesh>
    );
}

export default function ThreeGlass({
    modelUrl,
    speed = 1,
    amplitude = 0.05,
    motionVariant = 0,
    mouseInfluence = false,
}) {
    return (
        <div className="w-full h-full">
            {/* 4. Canvas Optimization: powerPreference and dpr */}
            <Canvas
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]} // Limits resolution on high-density screens for speed
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

                <Environment preset="sunset" />

                <Suspense fallback={<Loader />}>
                    <GlassModel
                        url={modelUrl}
                        speed={speed}
                        amplitude={amplitude}
                        motionVariant={motionVariant}
                        mouseInfluence={mouseInfluence}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
