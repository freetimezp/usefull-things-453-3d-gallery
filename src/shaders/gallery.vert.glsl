uniform float uTime;
uniform float uScrollVelocity;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  float bend = sin(uv.y * 3.14159265);

  pos.z += bend * uScrollVelocity * 0.04;
  pos.x += sin(uv.y * 3.14159265) * 0.025;

  vec4 worldPosition =
    modelMatrix * vec4(pos, 1.0);

  gl_Position =
    projectionMatrix *
    viewMatrix *
    worldPosition;
}