'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GUI from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

gsap.registerPlugin(ScrollTrigger);

export default function ThreeScene() {
    const containerRef = useRef(null);
    const slicesRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d0d0d);

        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 4);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        new RGBELoader().load('/images/studio_small_03_1k.hdr', hdrMap => {
            hdrMap.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = hdrMap;
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper); // Add it to the scene

        // -----------------------
        // LOAD GLB MODEL
        // -----------------------
        const loader = new GLTFLoader();
        loader.load('/models/model.glb', gltf => {
            const rawModel = gltf.scene;

            // const modelGroup = new THREE.Group();
            scene.add(rawModel);
            // modelGroup.add(rawModel);
            rawModel.scale.set(5, 5, 5);
            rawModel.position.set(-1.5, -0.5, 0);
            rawModel.rotation.set(0, 0, 0);

            slicesRef.current = [];

            rawModel.traverse(child => {
                if (child.isMesh) {
                    slicesRef.current.push(child);
                    console.log(child.name);
                }
            });

            const order = {
                Curve001: 2,
                Curve002: 1,
                Curve_1: 3,
                Curve003: 4,
                Curve004: 5,
                Curve005: 6,
                Curve006: 7,
            };

            slicesRef.current.sort((a, b) => {
                return order[a.name] - order[b.name];
            });

            slicesRef.current.forEach(slice => {
                slice.position.set(0.21, 0.19, 0.06);
                slice.rotation.set(0, 0, -0.181592653589793);
            });

            // Store original GLB transforms
            const originalTransforms = slicesRef.current.map(slice => ({
                position: slice.position.clone(),
                rotation: slice.rotation.clone(),
            }));

            // INITIAL TRANSFORMS
            // slicesRef.current[0].position.set(0, 0, 0); //1st slice
            // slicesRef.current[1].position.set(0, 0, 0); //2nd slice
            // slicesRef.current[2].position.set(0, 0, 0); // 3rd slice
            // slicesRef.current[3].position.set(0, 0, 0); //4th slice
            // slicesRef.current[4].position.set(0, 0, 0); //5th slice
            // slicesRef.current[5].position.set(0, 0, 0); // 6th slice
            // slicesRef.current[6].position.set(0, 0, 0); // last slice

            // slicesRef.current[0].rotation.set(0, 0, 0); //1st slice
            // slicesRef.current[1].rotation.set(0, 0, 0); //2nd slice
            // slicesRef.current[2].rotation.set(0, 0, 0); // 3rd slice
            // slicesRef.current[3].rotation.set(0, 0, 0); //4th slice
            // slicesRef.current[4].rotation.set(0, 0, 0); //5th slice
            // slicesRef.current[5].rotation.set(0, 0, 0); // 6th slice
            // slicesRef.current[6].rotation.set(0, 0, 0); // last slice

            const shared = {
                posX: 0,
                posY: 0,
                posZ: 0,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
            };

            const gui = new GUI();
            const syncFolder = gui.addFolder('Sync ALL Slices');

            syncFolder
                .add(shared, 'posX', -5, 5, 0.01)
                .name('pos X')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.position.x = v));
                });
            syncFolder
                .add(shared, 'posY', -5, 5, 0.01)
                .name('pos Y')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.position.y = v));
                });
            syncFolder
                .add(shared, 'posZ', -5, 5, 0.01)
                .name('pos Z')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.position.z = v));
                });

            syncFolder
                .add(shared, 'rotX', -Math.PI, Math.PI, 0.01)
                .name('rot X')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.rotation.x = v));
                });
            syncFolder
                .add(shared, 'rotY', -Math.PI, Math.PI, 0.01)
                .name('rot Y')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.rotation.y = v));
                });
            syncFolder
                .add(shared, 'rotZ', -Math.PI, Math.PI, 0.01)
                .name('rot Z')
                .onChange(v => {
                    slicesRef.current.forEach(s => (s.rotation.z = v));
                });

            syncFolder.open();

            const tl = gsap.timeline();

            slicesRef.current.forEach((slice, i) => {
                const finalPos = {
                    x: slicesRef.current[i].position.x,
                    y: slicesRef.current[i].position.y,
                    z: slicesRef.current[i].position.z,
                };

                const finalRot = {
                    x: slicesRef.current[i].rotation.x,
                    y: slicesRef.current[i].rotation.y,
                    z: slicesRef.current[i].rotation.z,
                };

                // Set slice back to original before animation
                slice.position.copy(originalTransforms[i].position);
                slice.rotation.copy(originalTransforms[i].rotation);

                // Animate to your custom final positions
                // tl.to(
                //     slice.position,
                //     {
                //         x: 0.4,
                //         y: 0.2,
                //         z: -0.18,
                //         duration: 3,
                //         ease: 'power3.inOut',
                //         // stagger: 0.15,
                //     },
                //     i * 0.12
                // );

                // // Animate to your custom final rotations
                // tl.to(
                //     slice.rotation,
                //     {
                //         x: 0,
                //         y: -1.53159265358979,
                //         z: 0.0484073464102068,
                //         duration: 3,
                //         ease: 'power3.inOut',
                //         // stagger: 0.15,
                //     },
                //     i * 0.12
                // );
            });
        });

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="bg-white h-full w-full">
            <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen  bg-white" />
        </div>
    );
}
