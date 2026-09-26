import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.1/three.module.min.js";
import gsap from "gsap";

import vertexShader from "../shaders/gallery.vert.glsl?raw";
import fragmentShader from "../shaders/gallery.frag.glsl?raw";

import image1 from "../assets/images/1.jpg";
import image2 from "../assets/images/2.jpg";
import image3 from "../assets/images/3.jpg";
import image4 from "../assets/images/4.jpg";
import image5 from "../assets/images/5.jpg";
import image6 from "../assets/images/6.jpg";
import image7 from "../assets/images/7.jpg";
import image8 from "../assets/images/8.jpg";
import image9 from "../assets/images/9.jpg";
import image10 from "../assets/images/10.jpg";

const IMAGE_PATHS = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
];

export default class WebGLGallery {
    constructor(canvas) {
        this.canvas = canvas;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#080808");

        this.clock = new THREE.Clock();

        this.scroll = {
            current: 0,
            target: 0,
            velocity: 0,
        };

        this.pointer = new THREE.Vector2();
        this.pointerTarget = new THREE.Vector2();

        this.rotation = 0;
        this.destroyed = false;

        this.textureLoader = new THREE.TextureLoader();
        this.textures = [];

        this.photoGroups = [];
        this.materials = [];

        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createGallery();
        this.createCenterSymbol();

        this.bindEvents();
        this.loadTextures();

        this.render();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.1,
            100,
        );

        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 1);

        this.scene.add(ambient);
    }

    createGallery() {
        this.gallery = new THREE.Group();
        this.scene.add(this.gallery);

        const stripCount = 5;
        const planesPerStrip = 6;
        const radius = 3.1;

        for (let stripIndex = 0; stripIndex < stripCount; stripIndex++) {
            const strip = new THREE.Group();

            const y = (stripIndex - 2) * 3.15;

            strip.position.y = y;

            const direction = stripIndex % 2 === 0 ? 1 : -1;

            for (let i = 0; i < planesPerStrip; i++) {
                const angle = (Math.PI * 2 * i) / planesPerStrip;

                const mesh = this.createPhotoMesh();

                mesh.position.set(
                    Math.sin(angle) * radius,
                    0,
                    Math.cos(angle) * radius,
                );

                mesh.lookAt(0, y, 0);

                mesh.rotation.y += Math.PI;

                mesh.userData.baseAngle = angle;
                mesh.userData.direction = direction;

                strip.add(mesh);
            }

            strip.userData.direction = direction;
            strip.userData.baseY = y;

            this.gallery.add(strip);
            this.photoGroups.push(strip);
        }
    }

    createPhotoMesh() {
        const geometry = new THREE.PlaneGeometry(1.5, 2.1, 24, 24);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: null,
                },
                uTime: {
                    value: 0,
                },
                uScrollVelocity: {
                    value: 0,
                },
                uOpacity: {
                    value: 0,
                },
            },

            vertexShader,
            fragmentShader,

            transparent: true,
            side: THREE.DoubleSide,
        });

        this.materials.push(material);

        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createCenterSymbol() {
        this.center = new THREE.Group();

        this.scene.add(this.center);

        const material = new THREE.MeshBasicMaterial({
            color: "#f1f0eb",
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide,
        });

        const geometry = new THREE.TorusGeometry(0.65, 0.025, 16, 96);

        const ring = new THREE.Mesh(geometry, material);

        ring.rotation.x = Math.PI / 2.1;

        this.center.add(ring);

        const innerGeometry = new THREE.TorusGeometry(0.38, 0.018, 16, 64);

        const innerRing = new THREE.Mesh(innerGeometry, material);

        innerRing.rotation.x = Math.PI / 2;

        this.center.add(innerRing);

        this.center.userData.ring = ring;
        this.center.userData.innerRing = innerRing;
    }

    async loadTextures() {
        const loadedTextures = await Promise.all(
            IMAGE_PATHS.map(
                (path) =>
                    new Promise((resolve) => {
                        this.textureLoader.load(
                            path,
                            (texture) => {
                                texture.colorSpace = THREE.SRGBColorSpace;

                                texture.wrapS = THREE.ClampToEdgeWrapping;
                                texture.wrapT = THREE.ClampToEdgeWrapping;

                                resolve(texture);
                            },
                            undefined,
                            () => resolve(null),
                        );
                    }),
            ),
        );

        if (this.destroyed) {
            loadedTextures.forEach((texture) => texture?.dispose());
            return;
        }

        this.textures = loadedTextures.filter(Boolean);

        this.applyTextures();

        gsap.to(
            this.materials.map((material) => material.uniforms.uOpacity),
            {
                value: 1,
                duration: 1.8,
                stagger: 0.035,
                ease: "power3.out",
            },
        );
    }

    applyTextures() {
        if (!this.textures.length) return;

        let index = 0;

        this.photoGroups.forEach((group) => {
            group.children.forEach((mesh) => {
                const material = mesh.material;

                material.uniforms.uTexture.value =
                    this.textures[index % this.textures.length];

                index++;
            });
        });
    }

    bindEvents() {
        this.onResize = this.onResize.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);

        window.addEventListener("resize", this.onResize);
        window.addEventListener("scroll", this.onScroll, {
            passive: true,
        });

        window.addEventListener("pointermove", this.onPointerMove, {
            passive: true,
        });

        this.onScroll();
    }

    onScroll() {
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

        this.scroll.target = progress;
    }

    onPointerMove(event) {
        this.pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;

        this.pointerTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    }

    update() {
        const elapsed = this.clock.getElapsedTime();

        this.scroll.current = THREE.MathUtils.lerp(
            this.scroll.current,
            this.scroll.target,
            0.06,
        );

        this.scroll.velocity = this.scroll.target - this.scroll.current;

        this.pointer.lerp(this.pointerTarget, 0.045);

        const progress = this.scroll.current;

        this.gallery.rotation.y = THREE.MathUtils.lerp(
            this.gallery.rotation.y,
            progress * Math.PI * 2,
            0.06,
        );

        this.gallery.position.y = THREE.MathUtils.lerp(
            this.gallery.position.y,
            -progress * 4.0,
            0.06,
        );

        this.gallery.position.x = THREE.MathUtils.lerp(
            this.gallery.position.x,
            this.pointer.x * 0.12,
            0.04,
        );

        this.gallery.rotation.x = THREE.MathUtils.lerp(
            this.gallery.rotation.x,
            this.pointer.y * 0.035,
            0.04,
        );

        this.photoGroups.forEach((group, index) => {
            group.rotation.y += (index % 2 === 0 ? 1 : -1) * 0.0015;

            group.position.x = Math.sin(elapsed * 0.25 + index) * 0.04;
        });

        this.materials.forEach((material) => {
            material.uniforms.uTime.value = elapsed;

            material.uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
                material.uniforms.uScrollVelocity.value,
                this.scroll.velocity * 10,
                0.08,
            );
        });

        this.center.rotation.z = elapsed * 0.1;
        this.center.rotation.y = this.pointer.x * 0.2;

        this.center.scale.setScalar(1 + Math.abs(this.scroll.velocity) * 0.5);
    }

    render() {
        if (this.destroyed) return;

        this.update();

        this.renderer.render(this.scene, this.camera);

        this.animationFrame = requestAnimationFrame(() => {
            this.render();
        });
    }

    destroy() {
        this.destroyed = true;

        cancelAnimationFrame(this.animationFrame);

        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("pointermove", this.onPointerMove);

        this.photoGroups.forEach((group) => {
            group.children.forEach((mesh) => {
                mesh.geometry.dispose();
            });
        });

        this.materials.forEach((material) => {
            material.dispose();
        });

        this.textures.forEach((texture) => {
            texture.dispose();
        });

        this.renderer.dispose();
    }
}
