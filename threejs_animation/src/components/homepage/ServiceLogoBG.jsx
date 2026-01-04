import { Environment, OrbitControls, Text, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';

function Model() {
    const { nodes } = useGLTF('/models/new4.glb');
    console.log(nodes);

    const torus = useRef(null);

    const sphere = useRef(null);

    useFrame(() => {
        // torus.current.rotation.x += 0.02;
        // sphere.current.rotation.x += 0.02;
        // sphere.current.rotation.y += 0.01;
    });

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },

        roughness: { value: 0, min: 0, max: 1, step: 0.1 },

        transmission: { value: 1, min: 0, max: 1, step: 0.1 },

        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },

        chromaticAberration: { value: 0.02, min: 0, max: 1 },

        backside: { value: true },

        metalness: { value: 0, min: 0, max: 1 },
    });

    return (
        <group>
            <Text
                font={'/fonts/Lausanne.otf'}
                position={[0, 0, -11]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                hello world!
            </Text>
            {/*
            <mesh ref={sphere} position={[0, 0, 0]} scale={[2, 2, 2]}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshTransmissionMaterial {...materialProps} />
            </mesh> */}
            <mesh ref={torus} {...nodes.Text002} scale={[2, 2, 2]} position={[0, 0, 0]}>
                <meshPhysicalMaterial transparent={true} opacity={1} />
            </mesh>
        </group>
    );
}

export default function NewScene() {
    return (
        <Canvas>
            <OrbitControls />
            <Model />
            <directionalLight intensity={2} position={[0, 2, 3]} />
            <Environment background={false} preset="city" />
        </Canvas>
    );
}
