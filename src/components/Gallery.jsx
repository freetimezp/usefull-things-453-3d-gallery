import { useEffect, useRef } from "react";

const projects = [
    "01 / HUMAN FORM",
    "02 / ARCHITECTURE",
    "03 / SILENT LIGHT",
    "04 / NATURAL SPACE",
    "05 / AFTER DARK",
];

export default function Gallery() {
    const pageRef = useRef(null);

    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;

        const handleScroll = () => {
            page.style.setProperty(
                "--scroll-progress",
                window.scrollY /
                    Math.max(
                        1,
                        document.documentElement.scrollHeight -
                            window.innerHeight,
                    ),
            );
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div ref={pageRef} className="gallery-ui">
            <header className="gallery-nav">
                <a className="gallery-brand" href="/">
                    F / ARCHIVE
                </a>

                <div className="gallery-nav-center">
                    <span>PHOTOGRAPHY</span>
                    <span>Exp. #453</span>
                </div>

                <button className="gallery-menu" type="button">
                    MENU <span>↗</span>
                </button>
            </header>

            <section className="gallery-hero">
                <div className="gallery-meta gallery-meta-left">
                    <span>SELECTED WORKS</span>
                    <span>2026</span>
                </div>

                <div className="gallery-meta gallery-meta-right">
                    <span>SCROLL / EXPLORE</span>
                    <span>01 — 05</span>
                </div>

                <div className="center-logo" aria-label="Form photography">
                    <div className="center-logo-symbol">
                        <span />
                        <span />
                    </div>

                    <h1>FORM</h1>

                    <p>THE ART OF SEEING</p>
                </div>

                <div className="gallery-intro">
                    <span>01 / INTRODUCTION</span>
                    <p>
                        An ongoing study of light,
                        <br />
                        space and human presence.
                    </p>
                </div>

                <div className="gallery-scroll">
                    <span className="scroll-line" />
                    <span>SCROLL TO DISCOVER</span>
                </div>
            </section>

            <section className="gallery-content">
                <div className="gallery-content-heading">
                    <span>THE COLLECTION</span>
                    <span>05 IMAGES</span>
                </div>

                {projects.map((project) => (
                    <div className="gallery-project" key={project}>
                        <span>{project}</span>
                    </div>
                ))}
            </section>

            <footer className="gallery-footer">
                <span>FORM / ARCHIVE</span>
                <span>ALL RIGHTS RESERVED</span>
            </footer>
        </div>
    );
}
