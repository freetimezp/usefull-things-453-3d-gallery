import { UseCanvas } from "@14islands/r3f-scroll-rig";
import { StickyScrollScene } from "@14islands/r3f-scroll-rig/powerups";
import React, { useRef } from "react";

import Logo from "./Elements/Logo";
import Strips from "./Elements/Strips";

const Gallery = () => {
    const track = useRef(null);

    return (
        <>
            <div ref={track} className="sticky top-0 left-0 h-screen w-full "></div>

            <UseCanvas>
                <StickyScrollScene track={track}>
                    {() => {
                        return (
                            <>
                                <Logo />
                                <Strips />
                            </>
                        );
                    }}
                </StickyScrollScene>
            </UseCanvas>
        </>
    );
};

export default Gallery;
