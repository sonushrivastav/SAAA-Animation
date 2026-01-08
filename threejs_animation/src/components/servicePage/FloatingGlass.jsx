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
    rotateX = true,
    rotationSpeed = 1,
    rotationOffset = 0,
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
        // console.log(clone);

        clone.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.needsUpdate = true;

                const originalColor = child.material.color;
                const originalMap = child.material.map || null;
                // child.material.color.set('#bebebe');

                // child.material = new THREE.MeshPhysicalMaterial({
                //     color: originalColor,
                //     map: originalMap,
                //     // metalness: 0,
                //     // roughness: 0.1,
                //     // transmission: 0.3,
                //     // opacity: 0.6,
                //     // transparent: true,
                //     // thickness: 0.5,
                //     // envMapIntensity: 1,
                //     // clearcoat: 1,
                //     // clearcoatRoughness: 0.1,
                //     // ior: 1.5,
                //     side: THREE.DoubleSide,
                // });

                // child.material.transparent = true;
                // child.material.opacity = 0.9;
            }
        });
        return clone;
    }, [originalScene]);

    const ref = useRef();
    const mouse = useRef({ x: 0, y: 0 });
    useEffect(() => {
        if (ref.current) {
            ref.current.rotation.y = rotationOffset;
        }
    }, [rotationOffset]);
    useEffect(() => {
        if (!mouseInfluence) return;
        const handleMouseMove = e => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseInfluence]);

    useFrame(({ clock, invalidate }) => {
        if (!ref.current) return;
        invalidate();

        const t = clock.getElapsedTime() * speed;
        const mesh = ref.current;

        const actualSpeed = 0.01 * rotationSpeed;
        mesh.rotation.y += actualSpeed;

        let targetX = 0;

        if (rotateX) {
            targetX += Math.sin(t * 1.5) * 0.1;
        }

        if (mouseInfluence) {
            targetX += mouse.current.y * 0.2;
        }

        mesh.rotation.x += (targetX - mesh.rotation.x) * 0.05;
    });

    return (
        <group position={[0, 0, 0]} scale={[5, 5, 5]}>
            <primitive ref={ref} position={[0.01, -0.4, 0]} object={scene} />
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
    rotateX = true,
    rotationSpeed = 0.5,
    rotationOffset = 0,
}) {
    return (
        <div className="w-full h-full ">
            <Canvas
                shadows={false}
                frameloop="demand"
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]} // Limits resolution on high-density screens for speed
            >
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />

                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <pointLight position={[-10, -10, 10]} intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />

                <directionalLight position={[-5, -5, 5]} intensity={0.6} />

                <Environment preset="studio" />
                <Suspense fallback={<Loader />}>
                    <GlassModel
                        url={modelUrl}
                        speed={speed}
                        amplitude={amplitude}
                        motionVariant={motionVariant}
                        mouseInfluence={mouseInfluence}
                        rotateX={rotateX}
                        rotationOffset={rotationOffset}
                        rotationSpeed={rotationSpeed}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
