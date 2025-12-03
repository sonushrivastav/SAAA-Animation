import React, { useRef } from "react";
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

export default function Model() {
  const { nodes } = useGLTF("/models/hashnew.glb");
  console.log(nodes, "nodes>>>>>>>>>>>>>>");

  const { viewport } = useThree();
  const torus = useRef(null);

  useFrame(() => {
    if (torus.current) torus.current.rotation.x += 0.02;
  });

  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
  });

  return (
    <group scale={viewport.width / 2.5}>
      <Text
        font={"/fonts/Lausanne.otf"}
        position={[0, 1, 0]}
        fontSize={0.4}
        color="white"
      >
        hello world!
      </Text>
      <mesh
        ref={torus}
        geometry={nodes.Text002.geometry}
        scale={[2, 2, 2]}
        position={[0, 0, 0]}
      >
        <MeshTransmissionMaterial
          {...materialProps}
          transparent={true}
          opacity={1}
        />
      </mesh>
    </group>
  );
}
