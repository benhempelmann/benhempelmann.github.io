precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform vec2 u_origin;
uniform float u_scale;

const float escapeRadius = 4.0;
const float escapeRadius2 = escapeRadius * escapeRadius;
const int maxIterations = 100;
const float invMaxIterations = 1.0 / float(maxIterations);

vec2 ipow2(vec2 v) {
  return vec2(v.x * v.x - v.y * v.y, v.x * v.y * 2.0);
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 paletteColor(float t) {
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.0, 0.1, 0.2);
  return palette(fract(t + 0.5), a, b, c, d);
}

void main() {
  float u = (gl_FragCoord.x - u_origin.x) / (u_scale * u_origin.x) + u_center.x;
  float v = (u_resolution.y - gl_FragCoord.y - u_origin.y) / (u_scale * u_origin.y) + u_center.y;
  vec2 uv = vec2(u,v);
  // vec2 uv = (gl_FragCoord.xy - u_origin) / (u_scale * u_origin) + u_center;

  
  vec2 z = vec2(0.0);
  vec2 c = uv;
  int iteration = 0;

  for (int i = 0; i < maxIterations; i++) {
    z = ipow2(z) + c;
    if (dot(z, z) > escapeRadius2) {
      break;
    }
    iteration++;
  }

  vec3 color = vec3(0.0);
  float distance2 = dot(z, z);
  if (distance2 > escapeRadius2) {
    float nu = log2(log(distance2) / 2.0);
    float fractionalIteration = clamp((float(iteration + 1) - nu) * invMaxIterations, 0.0, 1.0);
    color = paletteColor(fractionalIteration);
  }

  gl_FragColor = vec4(color, 1.0);
}
