import { Injectable } from '@angular/core';
import { mat4 } from 'gl-matrix';
import { MeshData } from './mesh';

@Injectable({
  providedIn: 'root',
})
export class ShaderLogic {
  public resizeCanvas(canvas: HTMLCanvasElement, renderContext?: WebGL2RenderingContext): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (renderContext) {
      renderContext.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  public async loadShaderFile(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load shader at ${url}`);
    }
    return await response.text();
  }

  public initWebGL(
    vsSource: string,
    fsSource: string,
    renderContext: WebGL2RenderingContext,
    backgroundColor: [number, number, number, number],
  ): {
    timeLoc: WebGLUniformLocation;
    program: WebGLProgram;
    mvMatrixLoc: WebGLUniformLocation;
    projMatrixLoc: WebGLUniformLocation;
    positionBuffer: WebGLBuffer;
    normalBuffer: WebGLBuffer;
  } {
    const vertexShader = this.compileShader(renderContext.VERTEX_SHADER, vsSource, renderContext);
    const fragmentShader = this.compileShader(
      renderContext.FRAGMENT_SHADER,
      fsSource,
      renderContext,
    );

    const program = renderContext.createProgram()!;
    if (!program) {
      throw new Error('Failed to create WebGL program');
    }
    renderContext.attachShader(program, vertexShader);
    renderContext.attachShader(program, fragmentShader);
    renderContext.linkProgram(program);

    if (!renderContext.getProgramParameter(program, renderContext.LINK_STATUS)) {
      const info = renderContext.getProgramInfoLog(program);
      renderContext.deleteProgram(program);
      throw new Error(`Unable to initialize the shader program: ${info}`);
    }

    const projMatrixLoc = renderContext.getUniformLocation(program, 'uProjectionMatrix')!;
    const mvMatrixLoc = renderContext.getUniformLocation(program, 'uModelViewMatrix')!;
    const timeLoc = renderContext.getUniformLocation(program, 'uTime')!;

    const positionBuffer = renderContext.createBuffer()!;
    const normalBuffer = renderContext.createBuffer()!;

    renderContext.enable(renderContext.DEPTH_TEST);
    renderContext.clearColor(...backgroundColor);

    return { timeLoc, program, projMatrixLoc, mvMatrixLoc, positionBuffer, normalBuffer };
  }

  public compileShader(
    type: number,
    source: string,
    renderContext: WebGL2RenderingContext,
  ): WebGLShader {
    const shader = renderContext.createShader(type)!;
    if (!shader) {
      throw new Error('Failed to create shader object');
    }
    renderContext.shaderSource(shader, source);
    renderContext.compileShader(shader);
    if (!renderContext.getShaderParameter(shader, renderContext.COMPILE_STATUS)) {
      const info = renderContext.getShaderInfoLog(shader);
      renderContext.deleteShader(shader);
      throw new Error(`Could not compile shader: ${info}`);
    }
    return shader;
  }

  public render(
    objectData: MeshData,
    time: number,
    controlCameraDistance: number[],
    controlCameraRotation: number[],
    controlRotationSpeed: number,
    renderContext: WebGL2RenderingContext,
    program: WebGLProgram,
    positionBuffer: WebGLBuffer,
    normalBuffer: WebGLBuffer,
    projMatrixLoc: WebGLUniformLocation,
    mvMatrixLoc: WebGLUniformLocation,
    timeLoc: WebGLUniformLocation,
  ): void {
    if (
      !renderContext ||
      !program ||
      !positionBuffer ||
      !normalBuffer ||
      !projMatrixLoc ||
      !mvMatrixLoc ||
      !timeLoc
    ) {
      return;
    }

    renderContext.viewport(0, 0, renderContext.canvas.width, renderContext.canvas.height);
    renderContext.clear(renderContext.COLOR_BUFFER_BIT | renderContext.DEPTH_BUFFER_BIT);

    renderContext.useProgram(program);

    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      (45 * Math.PI) / 180,
      renderContext.canvas.width / renderContext.canvas.height,
      0.1,
      100.0,
    );

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, controlCameraDistance);
    mat4.rotate(
      modelViewMatrix,
      modelViewMatrix,
      time * controlRotationSpeed,
      controlCameraRotation,
    );

    renderContext.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix);
    renderContext.uniformMatrix4fv(mvMatrixLoc, false, modelViewMatrix);
    renderContext.uniform1f(timeLoc, time);

    renderContext.bindBuffer(renderContext.ARRAY_BUFFER, positionBuffer);
    renderContext.bufferData(
      renderContext.ARRAY_BUFFER,
      objectData.positions,
      renderContext.DYNAMIC_DRAW,
    );

    const posAttribLoc = renderContext.getAttribLocation(program, 'aPosition');
    renderContext.vertexAttribPointer(posAttribLoc, 3, renderContext.FLOAT, false, 0, 0);
    renderContext.enableVertexAttribArray(posAttribLoc);

    renderContext.bindBuffer(renderContext.ARRAY_BUFFER, normalBuffer);
    renderContext.bufferData(
      renderContext.ARRAY_BUFFER,
      objectData.normals,
      renderContext.DYNAMIC_DRAW,
    );

    const normalAttribLoc = renderContext.getAttribLocation(program, 'aNormal');
    renderContext.vertexAttribPointer(normalAttribLoc, 3, renderContext.FLOAT, false, 0, 0);
    renderContext.enableVertexAttribArray(normalAttribLoc);

    renderContext.drawArrays(renderContext.TRIANGLES, 0, objectData.vertexCount);
  }

  public createSphere(radius: number, subdivision: number) {
    const positions: number[] = [];
    const normals: number[] = [];

    for (let i = 0; i <= subdivision; i++) {
      const theta = (i * Math.PI) / subdivision;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j <= subdivision; j++) {
        const phi = (j * 2 * Math.PI) / subdivision;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        normals.push(x, y, z);
        positions.push(x * radius, y * radius, z * radius);
      }
    }

    const indices: number[] = [];
    for (let i = 0; i < subdivision; i++) {
      for (let j = 0; j < subdivision; j++) {
        const first = i * (subdivision + 1) + j;
        const second = first + subdivision + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    const expandedPositions: number[] = [];
    const expandedNormals: number[] = [];
    for (const idx of indices) {
      expandedPositions.push(positions[idx * 3], positions[idx * 3 + 1], positions[idx * 3 + 2]);
      expandedNormals.push(normals[idx * 3], normals[idx * 3 + 1], normals[idx * 3 + 2]);
    }

    return {
      positions: new Float32Array(expandedPositions),
      normals: new Float32Array(expandedNormals),
      vertexCount: expandedPositions.length / 3,
    };
  }
}
