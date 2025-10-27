'use client';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef } from 'react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin();
}

export const spiralConfigs = [
    { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
    { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
    { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
    { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
    { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
    { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
    { s: 3.6, p: [-0.43, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
];

const FINAL_GROUP_ROTATION_Z = -Math.PI / 4;
const INITIAL_Y_OFFSET = -1.0;

const ScrollServiceLogo = ({ activeIndex }) => {
    const { scene } = useGLTF('/models/T3d.glb');
    const groupRef = useRef();
    const sliceRefs = useRef([]); // array of arrays (meshes per slice)

    // ✅ Prepare slices with independent meshes/materials
    const slices = useMemo(() => {
        const instances = [];

        spiralConfigs.forEach((cfg, index) => {
            const model = scene.clone(true);
            const meshes = [];

            model.traverse(child => {
                if (child.isMesh) {
                    const mat = child.material.clone();
                    mat.transparent = true;
                    mat.opacity = index === 0 ? 1 : 0.1; // first slice visible initially
                    child.material = mat;
                    meshes.push(child);
                }
            });

            model.scale.set(cfg.s, cfg.s, cfg.s);
            model.position.fromArray(cfg.p);
            model.rotation.fromArray(cfg.r);

            instances.push({ model, meshes });
        });

        return instances;
    }, [scene]);

    // ✅ Animate opacity for active slice
    useEffect(() => {
        if (!sliceRefs.current.length) return;

        sliceRefs.current.forEach((meshes, i) => {
            const targetOpacity = i === activeIndex ? 1 : 0.1;
            meshes.forEach(mesh => {
                gsap.to(mesh.material, {
                    opacity: targetOpacity,
                    duration: 1.5,
                    ease: 'power2.inOut',
                });
            });
        });
    }, [activeIndex]);

    return (
        <group
            ref={groupRef}
            scale={[1.8, 1.8, 1.7]}
            position={[-2, -2, 0]}
            rotation={[0, 0.2, -Math.PI / 3.5]}
        >
            {slices.map(({ model, meshes }, index) => (
                <primitive
                    key={index}
                    object={model}
                    ref={() => {
                        sliceRefs.current[index] = meshes;
                    }}
                />
            ))}
        </group>
    );
};

export default ScrollServiceLogo;
