import {
  ACESFilmicToneMapping, BoxGeometry, CanvasTexture, Color, Group, HemisphereLight,
  MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFShadowMap,
  PerspectiveCamera, PlaneGeometry, Scene, SpotLight, SRGBColorSpace, TextureLoader,
  TorusGeometry, type WebGLRenderer
} from "three";
import type { GalleryMediaItem } from "./gallery-media-schema";

export function createWeddingAlbum(renderer: WebGLRenderer, photos: readonly GalleryMediaItem[]) {
  const scene = new Scene();
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T): T => { resources.push(resource); return resource; };
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    scene.clear();
    resources.forEach((resource) => resource.dispose());
  };

  try {
    const colors = [new Color("#f3ede2"), new Color("#e5d4bb"), new Color("#4b1f2d")];
    const background = new Color();
    scene.background = background;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    const camera = new PerspectiveCamera(37, 1, 0.1, 160);
    scene.add(new HemisphereLight("#fff8e9", "#92765d", 3));
    const light = new SpotLight("#fff1d9", 155, 28, Math.PI / 3, 0.9, 2);
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    light.shadow.normalBias = 0.025;
    light.shadow.bias = -0.001;
    own(light.shadow);
    scene.add(light, light.target);
    const floorMaterial = own(new MeshStandardMaterial({ roughness: .9 }));
    const floor = new Mesh(own(new PlaneGeometry(80, 240)), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.35, -45);
    floor.receiveShadow = true;
    scene.add(floor);
    const box = own(new BoxGeometry(1, 1, .07));
    const plane = own(new PlaneGeometry(1, 1));
    const arch = own(new TorusGeometry(2.18, .022, 6, 80));
    const loader = new TextureLoader();

    const prints = photos.map((photo, index) => {
      const group = new Group();
      const paper = own(new MeshStandardMaterial({ color: "#fffaf1", roughness: .75, transparent: true }));
      const gold = own(new MeshStandardMaterial({ color: "#c9a56a", metalness: .5, roughness: .4, transparent: true }));
      const surface = own(new MeshBasicMaterial({ toneMapped: false, transparent: true }));
      const border = new Mesh(box, gold);
      border.position.z = -.035;
      const backing = new Mesh(box, paper);
      backing.castShadow = true;
      const image = new Mesh(plane, surface);
      image.position.z = .037;
      const halo = new Mesh(arch, gold);
      halo.position.z = -.85;
      halo.scale.x = .85;
      const pedestal = new Mesh(box, paper);
      pedestal.scale.set(3.7, .14, 19);
      pedestal.position.set(0, -2.25, -.5);
      pedestal.receiveShadow = true;
      group.add(border, backing, image, halo, pedestal);
      scene.add(group);
      const dimensions = { width: 2.5, height: 3.5 };
      function size(aspect: number) {
        dimensions.height = Math.min(3.5, 3.7 / aspect);
        dimensions.width = dimensions.height * aspect;
        image.scale.set(dimensions.width, dimensions.height, 1);
        backing.scale.set(dimensions.width + .18, dimensions.height + .22, 1);
        border.scale.set(dimensions.width + .22, dimensions.height + .26, 1);
      }
      size(5 / 7);
      const ready = new Promise<void>((resolve) => {
        own(loader.load(photo.publicUrl, (texture) => {
          if (disposed) { texture.dispose(); resolve(); return; }
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          size(MathUtils.clamp(texture.image.width / texture.image.height, .5, 2));
          surface.map = texture;
          surface.needsUpdate = true;
          resolve();
        }, undefined, () => {
          if (!disposed) {
            const canvas = document.createElement("canvas");
            canvas.width = 600; canvas.height = 800;
            const context = canvas.getContext("2d");
            if (context) {
              context.fillStyle = "#f7f3eb"; context.fillRect(0, 0, 600, 800);
              context.fillStyle = "#651f2d"; context.textAlign = "center";
              context.font = "italic 60px Georgia"; context.fillText("M / H", 300, 350);
              context.font = "24px Georgia"; context.fillText("Ảnh đang được cập nhật", 300, 430);
              const placeholder = own(new CanvasTexture(canvas));
              placeholder.colorSpace = SRGBColorSpace;
              surface.map = placeholder;
              surface.needsUpdate = true;
            }
          }
          resolve();
        }));
      });
      return { group, dimensions, materials: [paper, gold, surface], index, ready };
    });

    return {
      scene, camera, dispose,
      ready: Promise.all(prints.map((print) => print.ready)),
      update(progress: number, pointerX: number, pointerY: number, aspect: number) {
        const focus = MathUtils.clamp(progress, 0, 1) * Math.max(0, photos.length - 1);
        const travelZ = -focus * 9;
        const portrait = aspect <= 1.1;
        if (focus < 3) background.copy(colors[0]);
        else if (focus < 4) background.copy(colors[0]).lerp(colors[1], MathUtils.smoothstep(focus, 3, 4));
        else if (focus < 6) background.copy(colors[1]);
        else background.copy(colors[1]).lerp(colors[2], MathUtils.smoothstep(focus, 6, 7));
        floorMaterial.color.copy(background);
        prints.forEach(({ group, dimensions, materials, index }) => {
          const distance = index - focus;
          group.visible = Math.abs(distance) < 1.5;
          if (!group.visible) return;
          const alpha = 1 - MathUtils.smoothstep(Math.abs(distance), .25, 1.1);
          materials.forEach((material) => { material.opacity = alpha; });
          const fit = portrait ? Math.min(.95, (aspect * 5.8 - .35) / (dimensions.width + .22)) : 1;
          group.scale.setScalar(Math.max(.25, fit));
          group.position.set((portrait ? 0 : 1.48) + Math.sin(distance * 1.3) * (portrait ? 1.1 : 3.5), Math.abs(distance) * .35 - .08, -index * 9);
          group.rotation.set(pointerY * .025 + distance * .08, MathUtils.clamp(distance, -1, 1) * .65 + pointerX * .04, Math.sin(distance) * .09 * (index % 2 ? -1 : 1));
        });
        camera.aspect = aspect;
        camera.position.set(pointerX * .13, .16 + Math.sin(focus * Math.PI) * .16 + pointerY * .08, travelZ + (portrait ? 8.8 : 8));
        camera.lookAt(0, -.08, travelZ);
        camera.updateProjectionMatrix();
        light.position.set(-3, 6, travelZ + 5);
        light.target.position.set(portrait ? 0 : 1.48, 0, travelZ - 2);
      }
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
