#version 300 es
in vec4 aPosition;
in vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uTime;

out vec3 vNormal;
out vec3 vPosition;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float getCombined(vec3 pos) {
  vec3 b1 = vec3(sin(uTime * 0.7) * 2.5, cos(uTime * 0.5) * 2.2, sin(uTime * 0.3) * 1.8);
  vec3 b2 = vec3(cos(uTime * 0.6) * 2.4, sin(uTime * 0.8) * 2.5, cos(uTime * 0.4) * 2.0);
  vec3 b3 = vec3(sin(uTime * 0.4) * 2.2, cos(uTime * 0.9) * 2.4, sin(uTime * 0.6) * 2.2);

  float d1 = length(pos - b1) - 1.1;
  float d2 = length(pos - b2) - 0.9;
  float d3 = length(pos - b3) - 1.0;

  return smin(d1, smin(d2, d3, 1.6), 1.6);
}

void main() {
  vec3 pos = aPosition.xyz;
  float combined = getCombined(pos);

  vec3 displacedPos = pos - aNormal * (combined * 0.65);

  float eps = 0.01;
  vec3 tangent = normalize(cross(aNormal, vec3(0.0, 1.0, 0.0)));
  if (length(tangent) == 0.0) {
    tangent = normalize(cross(aNormal, vec3(1.0, 0.0, 0.0)));
  }
  vec3 bitangent = normalize(cross(aNormal, tangent));

  vec3 p1 = pos + tangent * eps;
  vec3 p2 = pos + bitangent * eps;
  float c1 = getCombined(p1);
  float c2 = getCombined(p2);

  vec3 dispP1 = p1 - aNormal * (c1 * 0.65);
  vec3 dispP2 = p2 - aNormal * (c2 * 0.65);

  vec3 crossDir = cross(dispP1 - displacedPos, dispP2 - displacedPos);
  vec3 computedNormal = aNormal;

  if (length(crossDir) > 0.0001) {
    computedNormal = normalize(crossDir);
  }

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(displacedPos, 1.0);
  vNormal = mat3(uModelViewMatrix) * computedNormal;
  vPosition = displacedPos;
}
