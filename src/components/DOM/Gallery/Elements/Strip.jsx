/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import Image from "./Image";

const Strip = ({ textures, y, numPlanes = 6, radius = 3 }) => {
    const group = useRef(null);
    const texturePicker = useRef(gsap.utils.random(textures, true));
    const direction = useRef(gsap.utils.random(-0.3, 0.3));

    const meshes = useMemo(
        () =>
            Array.from({ length: numPlanes }, (_, i) => {
                const angle = (Math.PI * 2 * i) / numPlanes;
                return (
                    <Image
                        key={i}
                        position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
                        lookAtY={y}
                        texture={texturePicker.current()}
                    />
                );
            }),
        [numPlanes, radius, y]
    );

    useEffect(() => {
        if (!group.current) return;
        const s = gsap.utils.random(110, 130);
        group.current.scale.set(s, s, s);
    }, []);

    useFrame(({ clock }) => {
        if (!group.current) return;
        group.current.rotation.y = clock.elapsedTime * direction.current;
    });

    return (
        <group ref={group} position={[0, y, 0]}>
            {meshes}
        </group>
    );
};

Strip.propTypes = {
    textures: PropTypes.array.isRequired,
    y: PropTypes.number.isRequired,
    numPlanes: PropTypes.number,
    radius: PropTypes.number,
};

export default Strip;
