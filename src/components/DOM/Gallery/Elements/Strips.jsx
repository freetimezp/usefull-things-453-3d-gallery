import React, { useEffect, useMemo, useRef } from "react";
import Strip from "./Strip";
import { useScrollbar } from "@14islands/r3f-scroll-rig";
import { useTexture } from "@react-three/drei";
import PropTypes from "prop-types";

const Strips = ({ numStrips = 15 }) => {
    const group = useRef(null);
    const globalLenis = useScrollbar();

    const textures = useTexture([
        "/images/1.jpg",
        "/images/2.jpg",
        "/images/3.jpg",
        "/images/4.jpg",
        "/images/5.jpg",
        "/images/6.jpg",
        "/images/7.jpg",
        "/images/8.jpg",
        "/images/9.jpg",
        "/images/10.jpg",
    ]);

    const stripsArray = useMemo(
        () => Array.from({ length: numStrips }, (_, i) => <Strip key={i} y={i * 150} textures={textures} />),
        [numStrips, textures]
    );

    useEffect(() => {
        if (!globalLenis?.__lenis || !group.current) return;

        const lenis = globalLenis.__lenis;
        const MAX_Y = 2500;

        const onScroll = ({ progress, velocity }) => {
            const v = Math.max(-5, Math.min(5, velocity));
            const scale = 1 + v * 0.002;

            group.current.scale.setScalar(scale);
            group.current.rotation.y = progress * Math.PI * 2;
            group.current.position.y = progress * MAX_Y - MAX_Y / 1.27;
        };

        lenis.on("scroll", onScroll);
        return () => lenis.off("scroll", onScroll);
    }, [globalLenis]);

    return <group ref={group}>{stripsArray}</group>;
};

Strips.propTypes = {
    numStrips: PropTypes.number,
};

export default Strips;
