import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  HostListener,
  inject,
} from '@angular/core';
import { ShaderLogic } from '../../core/logic/shader';
import { MeshData } from '../../core/logic/mesh';

@Component({
  selector: 'app-metaballs',
  imports: [],
  templateUrl: './metaballs.html',
  styleUrl: './metaballs.scss',
})
export class Metaballs implements AfterViewInit, OnDestroy {
  @ViewChild('glCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private shaderFunctionality = inject(ShaderLogic);

  private backgroundColor: [number, number, number, number] = [0.12, 0.12, 0.12, 4.0];
  // Dark theme and white theme is all zeroes.

  private controlCameraDistance: [number, number, number] = [0.0, 0.0, -5.0];
  private controlCameraRotation = [0.0, 1.0, 0.5];
  private controlRotationSpeed = 0.15;
  private animationFrameId = 0;

  private timeOffset = Math.random() * 1000;

  private gl!: WebGL2RenderingContext;
  private program!: WebGLProgram;
  private positionBuffer!: WebGLBuffer;
  private normalBuffer!: WebGLBuffer;

  private projMatrixLoc!: WebGLUniformLocation;
  private mvMatrixLoc!: WebGLUniformLocation;
  private timeLoc!: WebGLUniformLocation;

  private sphereData!: MeshData;

  async ngAfterViewInit(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    this.shaderFunctionality.resizeCanvas(canvas);

    this.gl = canvas.getContext('webgl2')!;
    if (!this.gl) {
      throw new Error('WebGL 2 not supported');
    }

    const vsSource = await this.shaderFunctionality.loadShaderFile(
      '/assets/shaders/metaballs.vert',
    );
    const fsSource = await this.shaderFunctionality.loadShaderFile(
      '/assets/shaders/metaballs.frag',
    );

    const initResult = this.shaderFunctionality.initWebGL(
      vsSource,
      fsSource,
      this.gl,
      this.backgroundColor,
    );
    this.program = initResult.program;
    this.mvMatrixLoc = initResult.mvMatrixLoc;
    this.projMatrixLoc = initResult.projMatrixLoc;
    this.timeLoc = initResult.timeLoc;
    this.positionBuffer = initResult.positionBuffer;
    this.normalBuffer = initResult.normalBuffer;
    this.sphereData = this.shaderFunctionality.createSphere(1.5, 128);
    this.startRenderLoop();
  }

  private startRenderLoop = (): void => {
    const time = this.timeOffset + performance.now() * 0.001;

    const minCamDistance = -2.0;
    const maxCamDistance = -9.0;
    const pulseSpeed = 0.2;
    const wave = (Math.sin(time * pulseSpeed) + 1.0) * 0.5;
    this.controlCameraDistance[2] = minCamDistance + (maxCamDistance - minCamDistance) * wave;

    this.shaderFunctionality.render(
      this.sphereData,
      time,
      this.controlCameraDistance,
      this.controlCameraRotation,
      this.controlRotationSpeed,
      this.gl,
      this.program,
      this.positionBuffer,
      this.normalBuffer,
      this.projMatrixLoc,
      this.mvMatrixLoc,
      this.timeLoc,
    );
    this.animationFrameId = requestAnimationFrame(this.startRenderLoop);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteBuffer(this.normalBuffer);
    this.gl.deleteProgram(this.program);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.canvasRef || !this.gl) {
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    this.shaderFunctionality.resizeCanvas(canvas);
  }
}
