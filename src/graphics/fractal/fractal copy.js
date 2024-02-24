import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import 

function sketch(p5) {
  let shaderProgram;
  p5.preload = () => {
    shaderProgram = p5.loadShader('shaders/vert.glsl', 'shaders/frag.glsl');
  }
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth,p5.windowHeight, p5.WEBGL);
  }
  
  p5.draw = () => {
    p5.shader(shaderProgram);
    shaderProgram.setUniform('myColor', [1.0,0.0,0.0]);
    p5.rect(0,0,p5.width,p5.height);
  };
}

export default function Fractal() {
  return <ReactP5Wrapper sketch={sketch} />;
}