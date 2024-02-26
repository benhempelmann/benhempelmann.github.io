precision highp float;

attribute vec2 aPosition;
uniform vec4 u_resolution;
uniform vec4 u_center;
uniform vec4 u_origin;
uniform vec2 u_scale;

vec2 ds_add (vec2 dsa, vec2 dsb)
{
vec2 dsc;
float t1, t2, e;

 t1 = dsa.x + dsb.x;
 e = t1 - dsa.x;
 t2 = ((dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y + dsb.y;

 dsc.x = t1 + t2;
 dsc.y = t2 - (dsc.x - t1);
 return dsc;
}

// Substract: res = ds_sub(a, b) => res = a - b
vec2 ds_sub (vec2 dsa, vec2 dsb)
{
vec2 dsc;
float e, t1, t2;

 t1 = dsa.x - dsb.x;
 e = t1 - dsa.x;
 t2 = ((-dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y - dsb.y;

 dsc.x = t1 + t2;
 dsc.y = t2 - (dsc.x - t1);
 return dsc;
}

// Compare: res = -1 if a < b
//              = 0 if a == b
//              = 1 if a > b
int ds_compare(vec2 dsa, vec2 dsb)
{
 if (dsa.x < dsb.x) return -1;
 else if (dsa.x == dsb.x) 
	{
	if (dsa.y < dsb.y) return -1;
	else if (dsa.y == dsb.y) return 0;
	else return 1;
	}
 else return 1;
}

// Multiply: res = ds_mul(a, b) => res = a * b
vec2 ds_mul (vec2 dsa, vec2 dsb)
{
vec2 dsc;
float c11, c21, c2, e, t1, t2;
float a1, a2, b1, b2, cona, conb, split = 8193.;

 cona = dsa.x * split;
 conb = dsb.x * split;
 a1 = cona - (cona - dsa.x);
 b1 = conb - (conb - dsb.x);
 a2 = dsa.x - a1;
 b2 = dsb.x - b1;

 c11 = dsa.x * dsb.x;
 c21 = a2 * b2 + (a2 * b1 + (a1 * b2 + (a1 * b1 - c11)));

 c2 = dsa.x * dsb.y + dsa.y * dsb.x;

 t1 = c11 + c2;
 e = t1 - c11;
 t2 = dsa.y * dsb.y + ((c2 - e) + (c11 - (t1 - e))) + c21;
 
 dsc.x = t1 + t2;
 dsc.y = t2 - (dsc.x - t1);
 
 return dsc;
}

vec2 ds_set(float a)
{
 vec2 z;
 z.x = a;
 z.y = 0.0;
 return z;
}

vec2 split(float a){
  float split = 4097.;
  float t = a*split;
  float a_hi = t-(t-a);
  float a_low = a-a_hi;
  return vec2(a_hi, a_low);
}

vec2 twoProd(float a, float b){
  float p = a*b;
  vec2 as = split(a);
  vec2 bs = split(b);
  float err = ((as.x-bs.x-p)
              + as.x*bs.y + as.y*bs.x)
              +as.y+bs.y;
  return vec2(p,err);
}

vec2 ds_div(vec2 b, vec2 a){
  float xn = 1.0/a.x;
  vec2 yn = ds_set(b.x * xn);
  float diff = (ds_sub(b,ds_mul(a,yn))).x;
  vec2 prod = twoProd(xn, diff);
  return ds_add(yn,prod);
}

// create double-single number from float

vec2 ipow2(vec2 v) {
  return vec2(v.x * v.x - v.y * v.y, v.x * v.y * 2.0);
}

vec4 dipow2(vec4 v){
  vec2 two = ds_set(2.0);
  return vec4(ds_sub(ds_mul(v.xy,v.xy),ds_mul(v.zw,v.zw)), ds_mul(ds_mul(v.xy,v.zw),two));
}

vec2 ddot(vec4 a, vec4 b){
  return ds_add(ds_mul(a.xy,b.xy),ds_mul(a.zw,b.zw));
}

const float escapeRadius = 100.0;
const float escapeRadius2 = escapeRadius * escapeRadius;
const int maxIterations = 100;

varying vec4 color;

void main() {
  vec2 descapeRadius = ds_set(100.0);
  vec2 descapeRadius2 = ds_mul(descapeRadius,descapeRadius);

  float u = (aPosition.x - u_origin.x) / (u_scale.x * u_origin.x) + u_center.x;
  float v = (u_resolution.z - aPosition.y - u_origin.z) / (u_scale.x * u_origin.z) + u_center.y;
  vec2 uv = vec2(u,v);  

  vec4 dFrag = vec4(ds_set(aPosition.x), ds_set(aPosition.y));
  vec2 du = ds_add(ds_div(ds_sub(dFrag.xy,u_origin.xy),ds_mul(u_scale,u_origin.xy)),u_center.xy);
  vec2 dv = ds_add(ds_div(ds_sub(ds_sub(u_resolution.zw,dFrag.zw),u_origin.zw),ds_mul(u_scale,u_origin.zw)), u_center.zw);
  vec4 dudv = vec4(du,dv);
  
  vec2 z = vec2(0.0);
  vec2 c = uv;
  int iteration;

  vec4 dz = vec4(ds_set(0.0), ds_set(0.0));
  vec4 dc = dudv;

  // Iterate until either the escape radius or max iteration is exceeded.
  for (int i = 0; i < maxIterations; i++) {
    z = ipow2(z) + c;
    if (dot(z, z) > escapeRadius2) {
      // break;
    }
    dz = dipow2(dz) + dc;
    int compRes = ds_compare(ddot(dz, dz), descapeRadius2);
    if (compRes == 1) {
      break;
    }
    iteration++;
  }

  float brightness = iteration >= maxIterations ? 0.0 : float(iteration) / float(maxIterations);
  color = vec4(vec3(brightness),1.0);
  // color = vec4(aPosition/u_resolution.xz,0.0,1.0);

  gl_Position = vec4((aPosition-u_resolution.xz/2.)/u_resolution.xz*2.,0.0,1.0);
}
