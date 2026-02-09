/* eslint-disable react/no-unknown-property */
import { useScrollbar } from "@14islands/r3f-scroll-rig";
import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

const Logo = () => {
    const model = useGLTF("/diamond.glb").nodes.diamond.geometry;
    const globalLenis = useScrollbar();
    const mesh = useRef(null);

    useEffect(() => {
        if (globalLenis?.__lenis) {
            globalLenis.__lenis.on("scroll", ({ progress, velocity }) => {
                const scale = velocity * 0.01 + 1;

                mesh.current.scale.set(scale, scale, scale);
                mesh.current.rotation.y = progress * Math.PI * 2;
            });
        }
    }, [globalLenis]);

    return (
        <group ref={mesh}>
            <mesh scale={100} geometry={model}>
                <meshNormalMaterial />
            </mesh>
        </group>
    );
};

export default Logo;
