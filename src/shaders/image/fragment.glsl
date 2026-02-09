uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec3 image = texture2D(uTexture, vUv).rgb;

    gl_FragColor = vec4(image, 0.5)
}