/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from "react";

import PropTypes from "prop-types";

import vertexShader from "../../../../shaders/image/vertex.glsl";
import fragmentShader from "../../../../shaders/image/fragment.glsl";

const Image = ({ lookAtY, position, texture }) => {
    const mesh = useRef(null);

    useEffect(() => {
        mesh.current.lookAt(0, lookAtY, 0);
    }, []);

    return (
        <>
            <mesh ref={mesh} position={position} scale={[1.5, 1, 1]}>
                <planeGeometry args={[1, 1, 32, 1]} />
                <meshBasicMaterial
                    map={texture}
                    side={2}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                />
            </mesh>
        </>
    );
};

Image.propTypes = {
    lookAtY: PropTypes.number.isRequired,
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    texture: PropTypes.object.isRequired,
};

export default Image;
