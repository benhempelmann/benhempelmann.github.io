import React, { useEffect, useRef } from 'react';

const Fractal = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let center = new Float64Array([-.5, 0.0]); // Initial center
    let origin = [0,0]; //overwritten in render;
    let zoomFactor = Number(.7);

    function pixelToCoord(pix){
      let x = (pix[0] - origin[0]) / (zoomFactor*origin[0]) + center[0];
      let y = (pix[1] - origin[1]) / (zoomFactor*origin[1]) + center[1];
      return([x,y]);
    }

    function zoom(zoomPix, zoomIn){
      center = pixelToCoord(zoomPix);
      zoomFactor *= 2.5;
      
    }

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
      const originUniformlocation = gl.getUniformLocation(program, 'u_origin');

      const render = () => {
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        origin = [canvas.width/2,canvas.height/2];

        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        let doubleCenter = new Float64Array([Math.fround(center[0]), Math.fround(center[0]) - center[0], Math.fround(center[1]), Math.fround(center[1]) - center[1]]);
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform4fv(centerUniformLocation, doubleCenter);
        gl.uniform2fv(originUniformlocation, origin);
        gl.uniform1f(scaleUniformLocation, zoomFactor);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      canvas.addEventListener("click", (e) => {
        e.preventDefault();
        let zoomIn = true;
        if(e.deltaY < 0) zoomIn = false;
        zoom([e.x,e.y],zoomIn);
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
