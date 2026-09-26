import { useEffect, useRef } from "react";
import Gallery from "./components/Gallery";
import "./index.css";

function App() {
    const canvasRef = useRef(null);

    useEffect(() => {
        let gallery;

        let cancelled = false;

        async function initializeGallery() {
            const { default: WebGLGallery } =
                await import("./components/WebGLGallery");

            if (cancelled) return;

            gallery = new WebGLGallery(canvasRef.current);
        }

        initializeGallery();

        return () => {
            cancelled = true;
            gallery?.destroy();
        };
    }, []);

    return (
        <main className="gallery-page">
            <canvas ref={canvasRef} className="webgl-canvas" />

            <Gallery />

            <div className="gallery-noise" aria-hidden="true" />
        </main>
    );
}

export default App;
