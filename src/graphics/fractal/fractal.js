import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Fractal = () => {
  const containerRef = useRef();
  const zoomSpeed = 0.7; // Adjust the zoom speed
  const zoomSmoothness = 0.1; // Adjust the smoothness (lower values make it smoother)

  const [targetZoom, setTargetZoom] = useState(1);
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 1));

  useEffect(() => {
    let camera;
    let renderer;
    let mandelbrotShader;

    let origin = []

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      mandelbrotShader.uniforms.resolution.value.set(newWidth, newHeight);
    };

    const handleMouseWheel = (event) => {
      const delta = event.deltaY;
      const zoomFactor = Math.pow(1.1, delta * -0.01 * zoomSpeed);

      setTargetZoom((prevZoom) => Math.max(0.1, prevZoom * zoomFactor));

      const mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;

      const targetX = targetPosition.x + mouseX * targetPosition.z * zoomFactor * zoomSmoothness;
      const targetY = targetPosition.y + mouseY * targetPosition.z * zoomFactor * zoomSmoothness;

      setTargetPosition(new THREE.Vector3(targetX, targetY, targetPosition.z * zoomFactor));
    };

    // Set up the scene
    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Set up the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Set up the Mandelbrot shader
    mandelbrotShader = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
      precision highp float;

      uniform vec2 resolution;
      uniform vec2 center;
      uniform float zoom;
      
      const float escapeRadius = 4.0;
      const float escapeRadius2 = escapeRadius * escapeRadius;
      const int maxIterations = 40;
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
        float u = (gl_FragCoord.x - resolution.x * 0.5) / (zoom * resolution.x) + center.x;
        float v = (gl_FragCoord.y - resolution.y * 0.5) / (zoom * resolution.y) + center.y;
        vec2 uv = vec2(u,v);
      
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
      
      `,
      uniforms: {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        center: { value: new THREE.Vector2(0, 0) },
        zoom: { value: targetZoom },
      },
    });

    // Set up the Mandelbrot plane
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const mandelbrotPlane = new THREE.Mesh(planeGeometry, mandelbrotShader);
    mandelbrotPlane.position.set(0, 0, 0); // Set the initial position to center
    scene.add(mandelbrotPlane);

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Handle mouse wheel for zooming
    window.addEventListener('wheel', handleMouseWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Smoothly interpolate camera position and zoom towards the target values
      camera.position.lerp(targetPosition, zoomSmoothness);
      camera.zoom = targetZoom;
      camera.updateProjectionMatrix();

      // Update uniforms for zoom and center
      mandelbrotShader.uniforms.zoom.value = targetZoom;
      mandelbrotShader.uniforms.center.value = new THREE.Vector2(
        camera.position.x / camera.position.z,
        -camera.position.y / camera.position.z
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up on component unmount
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleMouseWheel);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [targetZoom, targetPosition]);

  return <div ref={containerRef}></div>;
};

export default Fractal;
