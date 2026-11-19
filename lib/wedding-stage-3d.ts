import {
  ACESFilmicToneMapping, Color, CylinderGeometry, DataTexture, DoubleSide,
  ExtrudeGeometry, Group, HemisphereLight, LatheGeometry, Mesh, MeshPhysicalMaterial,
  MeshStandardMaterial, Path, PCFShadowMap, PerspectiveCamera, PlaneGeometry,
  PMREMGenerator, RepeatWrapping, RGBAFormat, Scene, Shape, SpotLight, Vector2,
  type WebGLRenderer
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function createWeddingStage(renderer: WebGLRenderer) {
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };
  const scene = new Scene();
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    scene.clear();
    resources.forEach((resource) => resource.dispose());
  };

  try {
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    scene.background = new Color("#f3ede1");

    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    try {
      scene.environment = own(pmrem.fromScene(room, 0.04)).texture;
    } finally {
      room.dispose();
      pmrem.dispose();
    }
    scene.environmentIntensity = 0.8;

    const camera = new PerspectiveCamera(42, 1, 0.1, 40);
    const fill = new HemisphereLight("#fff8e9", "#8a7159", 2.2);
    scene.add(fill);
    const key = new SpotLight("#fff2dc", 140, 28, Math.PI / 4, 1, 2);
    key.position.set(-3.8, 6, 6);
    key.target.position.set(0, -0.7, -0.5);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.bias = -0.001;
    key.shadow.normalBias = 0.025;
    own(key.shadow);
    scene.add(key, key.target);
    const rim = new SpotLight("#fffdfa", 80, 24, Math.PI / 3, 0.8, 2);
    rim.position.set(4, 3, -0.5);
    scene.add(rim);

    const stone = own(new MeshStandardMaterial({ color: "#e9dfce", roughness: 0.8 }));
    const paper = own(new MeshStandardMaterial({ color: "#f9f3e8", roughness: 0.72 }));
    const back = new Mesh(own(new PlaneGeometry(40, 24)), stone);
    back.position.z = -4;
    scene.add(back);

    const wallShape = new Shape();
    wallShape.moveTo(-16, -7);
    wallShape.lineTo(16, -7);
    wallShape.lineTo(16, 10);
    wallShape.lineTo(-16, 10);
    wallShape.closePath();
    const opening = new Path();
    opening.moveTo(-2.15, -5);
    opening.lineTo(-2.15, 0.55);
    opening.absarc(0, 0.55, 2.15, Math.PI, 0, true);
    opening.lineTo(2.15, -5);
    opening.closePath();
    wallShape.holes.push(opening);
    const wall = new Mesh(own(new ExtrudeGeometry(wallShape, {
      depth: 0.45, bevelEnabled: true, bevelThickness: 0.045,
      bevelSize: 0.045, bevelSegments: 2, curveSegments: 40
    })), paper);
    wall.position.z = -2.1;
    wall.receiveShadow = true;
    scene.add(wall);

    const floor = new Mesh(own(new PlaneGeometry(40, 30)), paper);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.6, -3);
    floor.receiveShadow = true;
    scene.add(floor);
    const pedestal = new Mesh(own(new CylinderGeometry(1.65, 1.76, 0.28, 80)), paper);
    pedestal.position.set(0, -2.34, -0.15);
    pedestal.receiveShadow = true;
    pedestal.castShadow = true;
    scene.add(pedestal);

    const bandProfile = [
      [0.84, -0.1], [0.85, -0.13], [0.96, -0.13], [0.99, -0.1],
      [0.99, 0.1], [0.96, 0.13], [0.85, 0.13], [0.84, 0.1], [0.84, -0.1]
    ].map(([radius, height]) => new Vector2(radius, height));
    const ringGeometry = own(new LatheGeometry(bandProfile, 112));
    const gold = own(new MeshPhysicalMaterial({
      color: "#d6aa64", metalness: 1, roughness: 0.19,
      clearcoat: 0.55, clearcoatRoughness: 0.24, envMapIntensity: 2.1
    }));
    const roseGold = own(gold.clone());
    roseGold.color.set("#bf8e62");
    const rings = new Group();
    const firstRing = new Mesh(ringGeometry, gold);
    firstRing.position.set(-0.48, 0.14, 0.08);
    firstRing.rotation.set(Math.PI / 2 + 0.22, -0.35, -0.28);
    firstRing.castShadow = true;
    const secondRing = new Mesh(ringGeometry, roseGold);
    secondRing.position.set(0.48, -0.08, -0.08);
    secondRing.rotation.set(Math.PI / 2 - 0.38, 0.5, 0.38);
    secondRing.castShadow = true;
    rings.add(firstRing, secondRing);
    scene.add(rings);

    // Real folded geometry gives the silk its changing highlights and perspective.
    const clothGeometry = own(new PlaneGeometry(1, 12, 112, 40));
    const positions = clothGeometry.attributes.position;
    for (let index = 0; index < positions.count; index++) {
      const u = positions.getX(index) + 0.5;
      const y = positions.getY(index);
      const phase = u * Math.PI * 18 + Math.sin(y * 0.38) * 0.24;
      positions.setZ(index, Math.cos(phase) * 0.105 + Math.cos(phase * 2) * 0.016);
      positions.setY(index, y - Math.sin(u * Math.PI) * 0.08);
    }
    clothGeometry.computeVertexNormals();

    const weaveData = new Uint8Array(64 * 64 * 4);
    for (let index = 0; index < 64 * 64; index++) {
      const thread = 128 + (index % 2 === 0 ? 6 : -6) + (Math.floor(index / 64) % 2 === 0 ? 3 : -3);
      weaveData.set([thread, thread, thread, 255], index * 4);
    }
    const weave = own(new DataTexture(weaveData, 64, 64, RGBAFormat));
    weave.wrapS = weave.wrapT = RepeatWrapping;
    weave.repeat.set(16, 12);
    weave.needsUpdate = true;
    const silk = own(new MeshPhysicalMaterial({
      color: "#cbb48d", roughness: 0.56, metalness: 0.04,
      sheen: 0.85, sheenColor: new Color("#fff1d1"), sheenRoughness: 0.72,
      bumpMap: weave, bumpScale: 0.008, side: DoubleSide
    }));
    const leftCurtain = new Mesh(clothGeometry, silk);
    const rightCurtain = new Mesh(clothGeometry, silk);
    leftCurtain.position.z = rightCurtain.position.z = 1.8;
    scene.add(leftCurtain, rightCurtain);

    return {
      scene, camera, dispose,
      update(progress: number, pointerX: number, pointerY: number, aspect: number) {
        const p = Math.max(0, Math.min(1, progress));
        const openingProgress = Math.min(1, p / 0.88);
        const eased = openingProgress * openingProgress * (3 - 2 * openingProgress);
        camera.aspect = aspect;
        camera.position.set(pointerX * 0.16 + p * 0.12, 0.18 + pointerY * 0.1, 9.6 - p * 1.3);
        camera.lookAt(0, -0.15, -0.5);
        camera.updateProjectionMatrix();

        const halfWidth = Math.tan(42 * Math.PI / 360) * (9.6 - 1.8) * aspect + 0.12;
        const width = halfWidth * (1 - eased * 0.7);
        const center = halfWidth * (0.5 + eased * 0.84);
        leftCurtain.scale.x = rightCurtain.scale.x = width;
        leftCurtain.position.x = -center;
        rightCurtain.position.x = center;
        leftCurtain.rotation.y = eased * 0.13;
        rightCurtain.rotation.y = -eased * 0.13;
        leftCurtain.rotation.z = eased * 0.018;
        rightCurtain.rotation.z = -eased * 0.018;
        rings.scale.setScalar(Math.min(1.13, aspect * 0.85 + 0.3));
        rings.position.y = -0.05 + Math.sin(p * Math.PI) * 0.14;
        rings.rotation.set(0.08 + pointerY * 0.025, -0.28 + p * 0.65 + pointerX * 0.08, -0.12 + p * 0.18);
        key.position.x = -3.8 + pointerX * 0.6;
      }
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
