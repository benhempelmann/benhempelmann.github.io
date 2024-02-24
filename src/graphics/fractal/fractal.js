import React, { useEffect, useRef } from 'react';

const Fractal = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let center = [0.0, 0.0]; // Initial center
    let scale = 1.0; // Initial scale

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    const fetchShader = async (url) => {
      const response = await fetch(url);
      const source = await response.text();
      return source;
    };

    const loadShaders = async () => {
      const vertexShaderSource = await fetchShader('/shaders/vert.glsl');
      const fragmentShaderSource = await fetchShader('/shaders/frag.glsl');

      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);

      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
        return;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
        return;
      }

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionAttribLocation = gl.getAttribLocation(program, 'aPosition');
      gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttribLocation);

      const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
      const centerUniformLocation = gl.getUniformLocation(program, 'u_center');
      const scaleUniformLocation = gl.getUniformLocation(program, 'u_scale');

      const render = () => {
        const { width, height } = canvas.getBoundingClientRect();

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform2fv(centerUniformLocation, center);
        gl.uniform1f(scaleUniformLocation, scale);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
        const mouseY = 1 - (e.clientY - rect.top) / rect.height * 2;

        const scaleFactor = e.deltaY < 0 ? 1.05 : 0.95;

        // Update scale based on the viewport size
        scale *= scaleFactor;

        // Adjust center to zoom around the mouse pointer
        center[0] -= (mouseX - center[0]) * (1-scaleFactor);
        center[1] -= (mouseY - center[1]) * (1-scaleFactor);

        render();
      });

      render();
    };

    loadShaders();

  }, []);

  return (
    <div className='w-full h-[95vh]'>
      <canvas ref={canvasRef} className='w-full h-full'/>
    </div>
  )
};

export default Fractal;
