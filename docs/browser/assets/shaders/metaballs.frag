#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vPosition;
uniform float uTime;

out vec4 fragColor;

void main() {
  vec3 lightDirection = normalize(vec3(0.5, 1.0, 0.8));
  float diffuse = max(dot(normalize(vNormal), lightDirection), 0.47);

  vec3 baseColor = 0.5 + 0.5 * cos(uTime * 0.4 + vNormal * 2.0 + vec3(0.0, 2.0, 4.0));

  vec3 color = baseColor * diffuse;

  float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
  color += vec3(0.1, 0.3, 0.5) * pow(rim, 3.0) * 0.3;

  fragColor = vec4(color, 1.0);
}
