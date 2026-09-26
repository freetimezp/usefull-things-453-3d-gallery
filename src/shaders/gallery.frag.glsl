uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  float gray = dot(
    tex.rgb,
    vec3(0.299, 0.587, 0.114)
  );

  vec3 image = mix(
    tex.rgb,
    vec3(gray),
    0.25
  );

  float edge = smoothstep(
    0.0,
    0.35,
    vUv.x
  ) * smoothstep(
    1.0,
    0.65,
    vUv.x
  );

  float vignette = mix(0.72, 1.0, edge);

  gl_FragColor = vec4(
    image * vignette,
    tex.a * uOpacity
  );
}