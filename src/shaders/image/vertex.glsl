varying vec2 vUv;

void main() {
    vec3 newPosition = position;

    newPosition.z -= sin(uv.x * 3.141) * 0.1; 

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}