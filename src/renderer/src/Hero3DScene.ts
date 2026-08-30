import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = new URL("./assets/static/media/hero/hero-character-v1.glb", import.meta.url).href;
const MAX_PIXEL_RATIO = 1.5;
const MAX_EYE_YAW = THREE.MathUtils.degToRad(14);
const MAX_EYE_PITCH = THREE.MathUtils.degToRad(8);
const EYE_DAMPING = 11;
const EYE_INPUT_GAIN = 2.4;
const POINTER_AXIS_DEAD_ZONE = 0.04;
const POINTER_AXIS_FULL_RESPONSE = 0.18;
const IRIS_HORIZONTAL_OFFSET_RATIO = 0.09;
const IRIS_VERTICAL_OFFSET_RATIO = 0.07;
const IRIS_EMISSIVE_INTENSITY = 0.24;
const DESKTOP_MODEL_HEIGHT_FRACTION = 0.88;
const EMBEDDED_IRIS_TARGETS = [
  { name: "left-eye", center: [0.84375, 0.74072], radius: [0.0053, 0.0057] },
  { name: "right-eye", center: [0.44336, 0.23437], radius: [0.0053, 0.0057] }
] as const;

export type Hero3DMetrics = {
  loadTimeMs: number | null;
  averageFps: number | null;
  renderedTriangles: number;
  pixelRatio: number;
};

type Hero3DSceneCallbacks = {
  onProgress?: (progress: number) => void;
  onReady?: (metrics: Hero3DMetrics) => void;
  onMetrics?: (metrics: Hero3DMetrics) => void;
  onError?: (message: string) => void;
};

type EyeRig = {
  name: string;
  group: any;
  eye: any;
  iris: any;
  baseQuaternion: any;
  targetQuaternion: any;
  baseIrisPosition: any;
  targetIrisPosition: any;
  baseIrisQuaternion: any;
  horizontalAxis: any;
  verticalAxis: any;
  maxIrisOffset: any;
  nodes: string[];
};

type Hero3DDebugSnapshot = {
  loaded: boolean;
  reducedMotion: boolean;
  pointer: [number, number];
  gaze: {
    projectedEyeCenter: [number, number];
    yawDegrees: number;
    pitchDegrees: number;
    gain: number;
  };
  eyeNodes: Array<{
    name: string;
    nodes: string[];
    rotationDegrees: [number, number, number];
    irisPosition: [number, number, number] | null;
    irisOffset: [number, number, number] | null;
    irisQuaternion: [number, number, number, number] | null;
    irisMaxOffset: [number, number];
  }>;
  bodyQuaternion: [number, number, number, number] | null;
  modelBounds: { width: number; height: number; depth: number } | null;
  metrics: Hero3DMetrics;
};

declare global {
  interface Window {
    __hero3dDebug?: {
      snapshot: () => Hero3DDebugSnapshot;
      setPointer: (x: number, y: number) => void;
      setPointerImmediate: (x: number, y: number) => void;
      setEyePartVisible: (part: "eye" | "iris", visible: boolean) => void;
      setBodyVisible: (visible: boolean) => void;
      raycastBody: (x: number, y: number) => unknown;
    };
  }
}

export default class Hero3DScene {
  private readonly container: HTMLElement;
  private readonly callbacks: Hero3DSceneCallbacks;
  private readonly scene: any;
  private readonly camera: any;
  private readonly renderer: any;
  private readonly loader: any;
  private readonly pointerTarget: any;
  private readonly pointerCurrent: any;
  private readonly eyeProjectionScratch: any;
  private readonly projectedEyeCenter: any;
  private readonly reducedMotionQuery: MediaQueryList;
  private readonly loadStartedAt = performance.now();
  private frameId: number | null = null;
  private disposed = false;
  private modelLoaded = false;
  private modelRoot: any = null;
  private dust: any = null;
  private grid: any = null;
  private eyeRigs: EyeRig[] = [];
  private bodyNode: any = null;
  private modelBounds: { width: number; height: number; depth: number } | null = null;
  private metrics: Hero3DMetrics;
  private fpsStartedAt = 0;
  private fpsFrames = 0;
  private fpsMeasured = false;
  private lastFrameAt = 0;
  private animationElapsed = 0;
  private debugFrame = 0;
  private eyeYaw = 0;
  private eyePitch = 0;
  private debugHandle: Window["__hero3dDebug"] = undefined;

  constructor(container: HTMLElement, callbacks: Hero3DSceneCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02060d, 0.024);
    this.camera = new THREE.PerspectiveCamera(31, 1, 0.01, 100);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.loader = new GLTFLoader();
    this.pointerTarget = new THREE.Vector2();
    this.pointerCurrent = new THREE.Vector2();
    this.eyeProjectionScratch = new THREE.Vector3();
    this.projectedEyeCenter = new THREE.Vector2();
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.metrics = {
      loadTimeMs: null,
      averageFps: null,
      renderedTriangles: 0,
      pixelRatio: Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
    };

    this.configureRenderer();
    this.createEnvironment();
    this.bindEvents();
    this.resize();
    this.installDebugHandle();
    this.loadModel();
    this.startLoop();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("blur", this.resetPointer);
    document.removeEventListener("mouseleave", this.resetPointer);
    this.reducedMotionQuery.removeEventListener("change", this.handleMotionPreferenceChange);

    const geometries = new Set<any>();
    const materials = new Set<any>();
    const textures = new Set<any>();

    this.scene.traverse((object: any) => {
      if (object.geometry) geometries.add(object.geometry);
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      objectMaterials.filter(Boolean).forEach((material: any) => {
        materials.add(material);
        Object.values(material).forEach((value: any) => {
          if (value?.isTexture) textures.add(value);
        });
      });
    });

    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();

    if (window.__hero3dDebug === this.debugHandle) {
      delete window.__hero3dDebug;
    }
    const host = this.container as HTMLElement & { __hero3dDebug?: Window["__hero3dDebug"] };
    if (host.__hero3dDebug === this.debugHandle) delete host.__hero3dDebug;
  }

  private configureRenderer(): void {
    this.renderer.setPixelRatio(this.metrics.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.setClearColor(0x02060d, 0);
    this.renderer.domElement.className = "hero3d-canvas";
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.appendChild(this.renderer.domElement);
  }

  private createEnvironment(): void {
    const ambient = new THREE.HemisphereLight(0x8fb8d2, 0x02040a, 0.72);
    const cyanKey = new THREE.DirectionalLight(0x58efff, 2.8);
    const neutralFill = new THREE.DirectionalLight(0xdceaff, 0.72);
    const violetRim = new THREE.DirectionalLight(0xa47dff, 2.15);

    cyanKey.position.set(-3.6, 2.8, -3.8);
    neutralFill.position.set(0.8, 2.1, -3.6);
    violetRim.position.set(3.8, 1.8, 2.8);
    cyanKey.target.position.set(0, 0.25, 0);
    neutralFill.target.position.set(0, 0.3, 0);
    violetRim.target.position.set(0, 0.15, 0);

    this.scene.add(
      ambient,
      cyanKey,
      neutralFill,
      violetRim,
      cyanKey.target,
      neutralFill.target,
      violetRim.target
    );

    this.grid = new THREE.GridHelper(10, 40, 0x1fd7f0, 0x0b4862);
    this.grid.position.set(0, -1.01, 1.6);
    const gridMaterials = Array.isArray(this.grid.material) ? this.grid.material : [this.grid.material];
    gridMaterials.forEach((material: any) => {
      material.transparent = true;
      material.opacity = 0.18;
      material.depthWrite = false;
    });
    this.scene.add(this.grid);

    const dustGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(180 * 3);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 8;
      positions[index + 1] = Math.random() * 3.8 - 1;
      positions[index + 2] = Math.random() * 6 - 0.5;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0x77eefa,
      size: 0.014,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.dust = new THREE.Points(dustGeometry, dustMaterial);
    this.scene.add(this.dust);
  }

  private loadModel(): void {
    this.loader.load(
      MODEL_URL,
      (gltf: { scene: any }) => {
        if (this.disposed) return;

        const root = gltf.scene;
        root.name = "hero-character-v1";
        root.rotation.y = Math.PI;
        root.updateMatrixWorld(true);
        root.traverse((object: any) => {
          if (!object.isMesh) return;
          object.frustumCulled = true;
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.filter(Boolean).forEach((material: any) => {
            material.envMapIntensity = 0.5;
            Object.values(material).forEach((value: any) => {
              if (value?.isTexture) {
                value.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
                value.needsUpdate = true;
              }
            });
          });
        });

        this.bodyNode = root.getObjectByName("mesh_node") ?? null;
        const embeddedEyeRigs = this.bodyNode ? this.createEmbeddedIrisRigs(this.bodyNode) : [];
        if (embeddedEyeRigs.length === EMBEDDED_IRIS_TARGETS.length) {
          ["eye L", "eye R", "Iris_L_Mesh", "Iris_R_Mesh"].forEach((name) => {
            const node = root.getObjectByName(name) ?? root.getObjectByName(name.replace(/\s+/g, "_"));
            if (node) node.visible = false;
          });
          this.eyeRigs = embeddedEyeRigs;
        } else {
          this.eyeRigs = [
            this.createEyeRig(root, "left-eye", "eye L", "Iris_L_Mesh"),
            this.createEyeRig(root, "right-eye", "eye R", "Iris_R_Mesh")
          ].filter((rig): rig is EyeRig => Boolean(rig));
        }

        const initialBox = new THREE.Box3().setFromObject(root);
        const center = initialBox.getCenter(new THREE.Vector3());
        root.position.sub(center);
        root.updateMatrixWorld(true);

        const fittedBox = new THREE.Box3().setFromObject(root);
        const size = fittedBox.getSize(new THREE.Vector3());
        this.modelBounds = { width: size.x, height: size.y, depth: size.z };
        this.modelRoot = root;
        this.scene.add(root);
        this.modelLoaded = true;
        this.metrics.loadTimeMs = performance.now() - this.loadStartedAt;
        this.resize();
        this.renderFrame();
        this.metrics.renderedTriangles = this.renderer.info.render.triangles;
        this.syncDebugDataset();
        this.callbacks.onProgress?.(1);
        this.callbacks.onReady?.({ ...this.metrics });
      },
      (event: ProgressEvent<EventTarget>) => {
        if (this.disposed || !event.total) return;
        this.callbacks.onProgress?.(Math.min(0.99, event.loaded / event.total));
      },
      (error: unknown) => {
        if (this.disposed) return;
        const message = error instanceof Error ? error.message : "3D model failed to load";
        this.callbacks.onError?.(message);
      }
    );
  }

  private createEmbeddedIrisRigs(body: any): EyeRig[] {
    const geometry = body.geometry;
    const sourceIndex = geometry?.getIndex?.();
    const positions = geometry?.getAttribute?.("position");
    const uvs = geometry?.getAttribute?.("uv");
    if (!geometry || !sourceIndex || !positions || !uvs || !body.material) return [];

    const selectedIndices = EMBEDDED_IRIS_TARGETS.map(() => [] as number[]);
    const remainingIndices: number[] = [];
    const indexArray = sourceIndex.array as ArrayLike<number>;

    for (let offset = 0; offset < indexArray.length; offset += 3) {
      const a = indexArray[offset];
      const b = indexArray[offset + 1];
      const c = indexArray[offset + 2];
      const centerU = (uvs.getX(a) + uvs.getX(b) + uvs.getX(c)) / 3;
      const centerV = (uvs.getY(a) + uvs.getY(b) + uvs.getY(c)) / 3;
      const targetIndex = EMBEDDED_IRIS_TARGETS.findIndex((target) => {
        const normalizedU = (centerU - target.center[0]) / target.radius[0];
        const normalizedV = (centerV - target.center[1]) / target.radius[1];
        return normalizedU * normalizedU + normalizedV * normalizedV <= 1;
      });

      if (targetIndex >= 0) {
        selectedIndices[targetIndex].push(a, b, c);
      } else {
        remainingIndices.push(a, b, c);
      }
    }

    if (selectedIndices.some((indices) => indices.length < 150)) return [];
    geometry.setIndex(remainingIndices);
    geometry.computeBoundingSphere();

    const bodyMaterials = Array.isArray(body.material) ? body.material : [body.material];
    const sourceMaterial = bodyMaterials.find(Boolean);
    if (!sourceMaterial) return [];

    const getSelectedBounds = (indices: number[]): any => {
      const bounds = new THREE.Box3();
      const point = new THREE.Vector3();
      indices.forEach((index) => {
        point.set(positions.getX(index), positions.getY(index), positions.getZ(index));
        bounds.expandByPoint(point);
      });
      return bounds;
    };

    const createSharedGeometry = (indices: number[], bounds: any): any => {
      const nextGeometry = new THREE.BufferGeometry();
      Object.entries(geometry.attributes).forEach(([name, attribute]) => {
        nextGeometry.setAttribute(name, attribute as any);
      });
      nextGeometry.setIndex(indices);
      nextGeometry.boundingBox = bounds.clone();
      nextGeometry.boundingSphere = bounds.getBoundingSphere(new THREE.Sphere());
      return nextGeometry;
    };

    return EMBEDDED_IRIS_TARGETS.map((target, targetIndex) => {
      const bounds = getSelectedBounds(selectedIndices[targetIndex]);
      const irisGeometry = createSharedGeometry(selectedIndices[targetIndex], bounds);
      const fillGeometry = createSharedGeometry(selectedIndices[targetIndex], bounds);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());

      const fillMaterial = new THREE.MeshStandardMaterial({
        color: 0xc6e3e8,
        roughness: 0.56,
        metalness: 0,
        emissive: 0x10272c,
        emissiveIntensity: 0.16
      });
      const fill = new THREE.Mesh(fillGeometry, fillMaterial);
      fill.name = `hero3d-${target.name}-sclera-fill`;
      fill.renderOrder = 1;
      body.add(fill);

      const irisMaterial = sourceMaterial.clone();
      irisMaterial.polygonOffset = true;
      irisMaterial.polygonOffsetFactor = -2;
      irisMaterial.polygonOffsetUnits = -2;
      if (irisMaterial.emissive) {
        irisMaterial.emissive.set(0x2d78a4);
        irisMaterial.emissiveMap = irisMaterial.map ?? irisMaterial.emissiveMap;
        irisMaterial.emissiveIntensity = IRIS_EMISSIVE_INTENSITY;
      }
      irisMaterial.needsUpdate = true;

      const iris = new THREE.Mesh(irisGeometry, irisMaterial);
      iris.name = `hero3d-${target.name}-iris`;
      iris.position.copy(center).multiplyScalar(-1);
      iris.renderOrder = 3;

      const group = new THREE.Group();
      group.name = `hero3d-${target.name}`;
      group.position.copy(center);
      group.add(iris);
      body.add(group);
      body.updateMatrixWorld(true);

      const groupWorldQuaternion = group.getWorldQuaternion(new THREE.Quaternion());
      const worldToGroupQuaternion = groupWorldQuaternion.clone().invert();
      const cameraForward = this.camera.getWorldDirection(new THREE.Vector3()).normalize();
      const cameraRight = new THREE.Vector3().crossVectors(cameraForward, this.camera.up).normalize();
      const cameraUp = this.camera.up.clone().applyQuaternion(this.camera.quaternion).normalize();

      return {
        name: target.name,
        group,
        eye: iris,
        iris,
        baseQuaternion: group.quaternion.clone(),
        targetQuaternion: group.quaternion.clone(),
        baseIrisPosition: iris.position.clone(),
        targetIrisPosition: iris.position.clone(),
        baseIrisQuaternion: iris.quaternion.clone(),
        horizontalAxis: cameraRight.applyQuaternion(worldToGroupQuaternion).normalize(),
        verticalAxis: cameraUp.applyQuaternion(worldToGroupQuaternion).normalize(),
        maxIrisOffset: new THREE.Vector2(
          size.x * IRIS_HORIZONTAL_OFFSET_RATIO,
          size.y * IRIS_VERTICAL_OFFSET_RATIO
        ),
        nodes: [iris.name, fill.name]
      };
    });
  }

  private createEyeRig(root: any, rigName: string, eyeName: string, irisName: string): EyeRig | null {
    const findNode = (name: string) => root.getObjectByName(name) ?? root.getObjectByName(name.replace(/\s+/g, "_"));
    const eye = findNode(eyeName);
    const iris = findNode(irisName);
    const anchor = eye ?? iris;
    if (!anchor) return null;

    root.updateMatrixWorld(true);
    const worldPosition = anchor.getWorldPosition(new THREE.Vector3());
    const localPosition = root.worldToLocal(worldPosition.clone());
    const group = new THREE.Group();
    group.name = `hero3d-${rigName}`;
    group.position.copy(localPosition);
    root.add(group);
    root.updateMatrixWorld(true);

    if (eye) group.attach(eye);
    if (iris) group.attach(iris);
    group.updateMatrixWorld(true);

    const configureEyePart = (
      node: any,
      renderOrder: number,
      polygonOffsetFactor: number,
      enhanceIris = false
    ): void => {
      if (!node?.isMesh) return;
      const sourceMaterials = Array.isArray(node.material) ? node.material : [node.material];
      const isolatedMaterials = sourceMaterials.filter(Boolean).map((material: any) => {
        const clone = material.clone();
        clone.side = THREE.DoubleSide;
        clone.polygonOffset = true;
        clone.polygonOffsetFactor = polygonOffsetFactor;
        clone.polygonOffsetUnits = polygonOffsetFactor;
        if (enhanceIris && clone.emissive) {
          clone.emissive.set(0x4b9bc8);
          clone.emissiveMap = clone.map ?? clone.emissiveMap;
          clone.emissiveIntensity = IRIS_EMISSIVE_INTENSITY;
        }
        if (enhanceIris && typeof clone.roughness === "number") {
          clone.roughness = Math.min(clone.roughness, 0.42);
        }
        clone.needsUpdate = true;
        return clone;
      });
      node.material = Array.isArray(node.material) ? isolatedMaterials : isolatedMaterials[0];
      node.renderOrder = renderOrder;
    };

    configureEyePart(eye, 2, -1);
    configureEyePart(iris, 3, -2, true);

    const groupWorldQuaternion = group.getWorldQuaternion(new THREE.Quaternion());
    const worldToGroupQuaternion = groupWorldQuaternion.clone().invert();
    const cameraForward = this.camera.getWorldDirection(new THREE.Vector3()).normalize();
    const cameraRight = new THREE.Vector3().crossVectors(cameraForward, this.camera.up).normalize();
    const cameraUp = this.camera.up.clone().applyQuaternion(this.camera.quaternion).normalize();
    const horizontalAxis = cameraRight.applyQuaternion(worldToGroupQuaternion).normalize();
    const verticalAxis = cameraUp.applyQuaternion(worldToGroupQuaternion).normalize();
    const irisSize = iris
      ? new THREE.Box3().setFromObject(iris).getSize(new THREE.Vector3())
      : new THREE.Vector3();
    const baseIrisPosition = iris?.position.clone() ?? new THREE.Vector3();

    return {
      name: rigName,
      group,
      eye,
      iris,
      baseQuaternion: group.quaternion.clone(),
      targetQuaternion: group.quaternion.clone(),
      baseIrisPosition,
      targetIrisPosition: baseIrisPosition.clone(),
      baseIrisQuaternion: iris?.quaternion.clone() ?? new THREE.Quaternion(),
      horizontalAxis,
      verticalAxis,
      maxIrisOffset: new THREE.Vector2(
        irisSize.x * IRIS_HORIZONTAL_OFFSET_RATIO,
        irisSize.y * IRIS_VERTICAL_OFFSET_RATIO
      ),
      nodes: [eye?.name, iris?.name].filter(Boolean)
    };
  }

  private startLoop(): void {
    if (this.disposed || this.reducedMotionQuery.matches || this.frameId !== null) {
      this.renderFrame();
      return;
    }
    this.lastFrameAt = performance.now();
    this.frameId = requestAnimationFrame(this.animate);
  }

  private stopLoop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private animate = (timestamp: number): void => {
    if (this.disposed || this.reducedMotionQuery.matches) {
      this.frameId = null;
      return;
    }

    const delta = Math.min(Math.max(0, timestamp - this.lastFrameAt) / 1000, 0.05);
    this.lastFrameAt = timestamp;
    this.animationElapsed += delta;
    const damping = 1 - Math.exp(-EYE_DAMPING * delta);
    this.pointerCurrent.lerp(this.pointerTarget, damping);
    this.updateEyes(damping);
    this.debugFrame += 1;
    if (this.debugFrame % 8 === 0) this.syncDebugDataset();

    if (this.dust) {
      this.dust.rotation.y = Math.sin(this.animationElapsed * 0.06) * 0.035;
      this.dust.position.y = Math.sin(this.animationElapsed * 0.18) * 0.025;
    }

    this.renderFrame();
    this.measureFps();
    this.frameId = requestAnimationFrame(this.animate);
  };

  private updateEyes(damping: number): void {
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);

    let projectedX = 0;
    let projectedY = 0;
    this.eyeRigs.forEach((rig) => {
      rig.group.getWorldPosition(this.eyeProjectionScratch).project(this.camera);
      projectedX += this.eyeProjectionScratch.x;
      projectedY += this.eyeProjectionScratch.y;
    });

    const eyeCount = Math.max(1, this.eyeRigs.length);
    this.projectedEyeCenter.set(projectedX / eyeCount, projectedY / eyeCount);

    const horizontalWeight = THREE.MathUtils.smoothstep(
      Math.abs(this.pointerCurrent.x),
      POINTER_AXIS_DEAD_ZONE,
      POINTER_AXIS_FULL_RESPONSE
    );
    const verticalWeight = THREE.MathUtils.smoothstep(
      Math.abs(this.pointerCurrent.y),
      POINTER_AXIS_DEAD_ZONE,
      POINTER_AXIS_FULL_RESPONSE
    );
    const horizontalInput =
      (this.pointerCurrent.x - this.projectedEyeCenter.x) * EYE_INPUT_GAIN * horizontalWeight;
    const verticalInput =
      (this.pointerCurrent.y - this.projectedEyeCenter.y) * EYE_INPUT_GAIN * verticalWeight;
    const yaw = THREE.MathUtils.clamp(-horizontalInput * MAX_EYE_YAW, -MAX_EYE_YAW, MAX_EYE_YAW);
    const pitch = THREE.MathUtils.clamp(verticalInput * MAX_EYE_PITCH, -MAX_EYE_PITCH, MAX_EYE_PITCH);
    this.eyeYaw = yaw;
    this.eyePitch = pitch;
    const offsetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));
    const horizontalGaze = MAX_EYE_YAW > 0 ? -yaw / MAX_EYE_YAW : 0;
    const verticalGaze = MAX_EYE_PITCH > 0 ? pitch / MAX_EYE_PITCH : 0;

    this.eyeRigs.forEach((rig) => {
      rig.targetQuaternion.copy(rig.baseQuaternion).multiply(offsetQuaternion);
      rig.group.quaternion.slerp(rig.targetQuaternion, damping);

      if (rig.iris) {
        rig.targetIrisPosition
          .copy(rig.baseIrisPosition)
          .addScaledVector(rig.horizontalAxis, horizontalGaze * rig.maxIrisOffset.x)
          .addScaledVector(rig.verticalAxis, verticalGaze * rig.maxIrisOffset.y);
        rig.iris.position.lerp(rig.targetIrisPosition, damping);
      }
    });
  }

  private renderFrame(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private measureFps(): void {
    if (!this.modelLoaded || this.fpsMeasured) return;
    const now = performance.now();
    if (!this.fpsStartedAt) this.fpsStartedAt = now;
    this.fpsFrames += 1;
    const elapsed = now - this.fpsStartedAt;
    if (elapsed < 2400) return;

    this.metrics.averageFps = (this.fpsFrames * 1000) / elapsed;
    this.metrics.renderedTriangles = this.renderer.info.render.triangles;
    this.fpsMeasured = true;
    this.callbacks.onMetrics?.({ ...this.metrics });
  }

  private handlePointerMove = (event: PointerEvent): void => {
    if (this.reducedMotionQuery.matches || window.innerWidth < 768) return;
    const normalizedX = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const normalizedY = 1 - (event.clientY / Math.max(1, window.innerHeight)) * 2;
    this.setPointer(normalizedX, normalizedY);
  };

  private setPointer = (x: number, y: number): void => {
    if (this.reducedMotionQuery.matches) return;
    this.pointerTarget.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  };

  private setPointerImmediate = (x: number, y: number): void => {
    if (this.reducedMotionQuery.matches) return;
    const nextX = THREE.MathUtils.clamp(x, -1, 1);
    const nextY = THREE.MathUtils.clamp(y, -1, 1);
    this.pointerTarget.set(nextX, nextY);
    this.pointerCurrent.set(nextX, nextY);
    this.updateEyes(1);
    this.renderFrame();
    this.syncDebugDataset();
  };

  private resetPointer = (): void => {
    this.pointerTarget.set(0, 0);
  };

  private setEyePartVisible = (part: "eye" | "iris", visible: boolean): void => {
    this.eyeRigs.forEach((rig) => {
      const node = part === "eye" ? rig.eye : rig.iris;
      if (node) node.visible = visible;
    });
    this.renderFrame();
  };

  private setBodyVisible = (visible: boolean): void => {
    if (this.bodyNode) this.bodyNode.visible = visible;
    this.renderFrame();
  };

  private raycastBody = (x: number, y: number): unknown => {
    if (!this.modelRoot) return null;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    return raycaster.intersectObject(this.modelRoot, true).slice(0, 6).map((hit: any) => ({
      object: hit.object.name,
      faceIndex: hit.faceIndex,
      uv: hit.uv ? [hit.uv.x, hit.uv.y] : null,
      point: [hit.point.x, hit.point.y, hit.point.z]
    }));
  };

  private resize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    this.renderer.setSize(width, height, false);

    if (this.modelBounds) {
      const verticalFraction = width < 768 ? 0.68 : DESKTOP_MODEL_HEIGHT_FRACTION;
      const visibleHeight = this.modelBounds.height / verticalFraction;
      const distance = visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)));
      this.camera.position.set(0, width < 768 ? 0.02 : 0, -distance);
    } else {
      this.camera.position.set(0, 0, -4.5);
    }

    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.renderFrame();
  };

  private handleMotionPreferenceChange = (): void => {
    this.resetPointer();
    this.pointerCurrent.set(0, 0);
    this.eyeRigs.forEach((rig) => {
      rig.group.quaternion.copy(rig.baseQuaternion);
      if (rig.iris) {
        rig.iris.position.copy(rig.baseIrisPosition);
        rig.iris.quaternion.copy(rig.baseIrisQuaternion);
      }
    });
    if (this.reducedMotionQuery.matches) {
      this.stopLoop();
      this.renderFrame();
      this.syncDebugDataset();
    } else {
      this.startLoop();
    }
  };

  private bindEvents(): void {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    window.addEventListener("blur", this.resetPointer);
    document.addEventListener("mouseleave", this.resetPointer);
    this.reducedMotionQuery.addEventListener("change", this.handleMotionPreferenceChange);
  }

  private installDebugHandle(): void {
    this.debugHandle = {
      snapshot: this.getDebugSnapshot,
      setPointer: this.setPointer,
      setPointerImmediate: this.setPointerImmediate,
      setEyePartVisible: this.setEyePartVisible,
      setBodyVisible: this.setBodyVisible,
      raycastBody: this.raycastBody
    };
    window.__hero3dDebug = this.debugHandle;
    const host = this.container as HTMLElement & { __hero3dDebug?: Window["__hero3dDebug"] };
    host.__hero3dDebug = this.debugHandle;
  }

  private syncDebugDataset(): void {
    const snapshot = this.getDebugSnapshot();
    this.container.dataset.hero3dReady = String(snapshot.loaded);
    this.container.dataset.hero3dReducedMotion = String(snapshot.reducedMotion);
    this.container.dataset.hero3dPointer = snapshot.pointer.map((value) => value.toFixed(4)).join(",");
    this.container.dataset.hero3dEyes = JSON.stringify(snapshot.eyeNodes);
    this.container.dataset.hero3dBody = snapshot.bodyQuaternion?.map((value) => value.toFixed(6)).join(",") ?? "";
    this.container.dataset.hero3dMetrics = JSON.stringify(snapshot.metrics);
  }

  private getDebugSnapshot = (): Hero3DDebugSnapshot => {
    const radiansToDegrees = THREE.MathUtils.radToDeg;
    return {
      loaded: this.modelLoaded,
      reducedMotion: this.reducedMotionQuery.matches,
      pointer: [this.pointerCurrent.x, this.pointerCurrent.y],
      gaze: {
        projectedEyeCenter: [this.projectedEyeCenter.x, this.projectedEyeCenter.y],
        yawDegrees: radiansToDegrees(this.eyeYaw),
        pitchDegrees: radiansToDegrees(this.eyePitch),
        gain: EYE_INPUT_GAIN
      },
      eyeNodes: this.eyeRigs.map((rig) => {
        const rotation = new THREE.Euler().setFromQuaternion(rig.group.quaternion, "YXZ");
        const irisOffset = rig.iris ? rig.iris.position.clone().sub(rig.baseIrisPosition) : null;
        return {
          name: rig.name,
          nodes: rig.nodes,
          rotationDegrees: [
            radiansToDegrees(rotation.x),
            radiansToDegrees(rotation.y),
            radiansToDegrees(rotation.z)
          ],
          irisPosition: rig.iris
            ? [rig.iris.position.x, rig.iris.position.y, rig.iris.position.z]
            : null,
          irisOffset: irisOffset ? [irisOffset.x, irisOffset.y, irisOffset.z] : null,
          irisQuaternion: rig.iris
            ? [rig.iris.quaternion.x, rig.iris.quaternion.y, rig.iris.quaternion.z, rig.iris.quaternion.w]
            : null,
          irisMaxOffset: [rig.maxIrisOffset.x, rig.maxIrisOffset.y]
        };
      }),
      bodyQuaternion: this.bodyNode
        ? [this.bodyNode.quaternion.x, this.bodyNode.quaternion.y, this.bodyNode.quaternion.z, this.bodyNode.quaternion.w]
        : null,
      modelBounds: this.modelBounds ? { ...this.modelBounds } : null,
      metrics: { ...this.metrics }
    };
  };
}
