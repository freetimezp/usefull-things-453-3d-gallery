import { useGLTF } from "@react-three/drei";
import React from "react";

const Logo = () => {
    const model = useGLTF("/diamond.glb");

    return (
        <group>
            <mesh scale={100}>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>
        </group>
    );
};

export default Logo;
