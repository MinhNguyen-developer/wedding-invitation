import {
  ACESFilmicToneMapping, BoxGeometry, Color, Group, HemisphereLight, MathUtils,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFShadowMap, PerspectiveCamera,
  PlaneGeometry, Scene, SpotLight, SRGBColorSpace, TextureLoader, type WebGLRenderer
} from "three";
import type { MotionValue } from "framer-motion";
import type { GalleryMediaItem } from "./gallery-media-schema";

export function createWeddingAlbum(renderer: WebGLRenderer, photos: readonly GalleryMediaItem[], selection: MotionValue<number>) {
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
    scene.background = new Color("#eee5d7");
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    const camera = new PerspectiveCamera(37, 1, 0.1, 40);
    scene.add(new HemisphereLight("#fffaf0", "#b49b7e", 3));
    const light = new SpotLight("#fff2d7", 130, 30, Math.PI / 3, 0.9, 2);
    light.position.set(-4, 7, 6);
    light.target.position.set(0, 0, -1);
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    light.shadow.bias = -0.001;
    light.shadow.normalBias = 0.025;
    own(light.shadow);
    scene.add(light, light.target);

    const floor = new Mesh(own(new PlaneGeometry(60, 60)), own(new MeshStandardMaterial({ color: "#eee5d7", roughness: 0.95 })));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.12;
    floor.receiveShadow = true;
    scene.add(floor);

    const paper = own(new MeshStandardMaterial({ color: "#fffaf1", roughness: 0.72 }));
    const edge = own(new MeshStandardMaterial({ color: "#c8af82", metalness: 0.35, roughness: 0.55 }));
    const printGeometry = own(new BoxGeometry(2.64, 3.42, 0.065));
    const photoGeometry = own(new PlaneGeometry(2.36, 2.98));
    const loader = new TextureLoader();
    const prints: Group[] = [];
    const loads = photos.map((photo) => {
      const print = new Group();
      const backing = new Mesh(printGeometry, [edge, edge, paper, paper, paper, paper]);
      backing.castShadow = true;
      backing.receiveShadow = true;
      print.add(backing);
      const surface = own(new MeshBasicMaterial({ color: "#ffffff", toneMapped: false }));
      const image = new Mesh(photoGeometry, surface);
      image.position.set(0, 0.07, 0.034);
      print.add(image);
      scene.add(print);
      prints.push(print);
      return new Promise<void>((resolve, reject) => {
        own(loader.load(photo.publicUrl, (texture) => {
          if (disposed) { texture.dispose(); resolve(); return; }
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          const imageAspect = texture.image.width / texture.image.height;
          const printAspect = 2.36 / 2.98;
          if (imageAspect > printAspect) texture.repeat.x = printAspect / imageAspect;
          else texture.repeat.y = imageAspect / printAspect;
          texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
          surface.map = texture;
          surface.needsUpdate = true;
          resolve();
        }, undefined, reject));
      });
    });

    let rotation = selection.get();
    let settling = false;
    return {
      scene, camera, dispose,
      ready: Promise.all(loads),
      needsRender: () => settling,
      update(progress: number, pointerX: number, pointerY: number, aspect: number) {
        const count = photos.length;
        // Follow the shortest direction across the last/first image boundary.
        const delta = MathUtils.euclideanModulo(selection.get() - rotation + count / 2, count) - count / 2;
        rotation += delta * 0.11;
        settling = Math.abs(delta) > 0.001;
        const scroll = MathUtils.clamp(progress, 0, 1);
        const spread = MathUtils.lerp(0.78, 1.08, scroll);
        prints.forEach((print, index) => {
          const angle = (index - rotation) * Math.PI * 2 / count;
          print.position.set(Math.sin(angle) * 3.65 * spread, Math.cos(angle) * 0.13, (Math.cos(angle) - 1) * 1.25);
          print.rotation.set(-0.045 + pointerY * 0.035, Math.sin(angle) * -0.48 + pointerX * 0.045, Math.sin(angle) * -0.09);
        });
        camera.aspect = aspect;
        camera.position.set(pointerX * 0.2, 0.25 + (scroll - 0.5) * 0.7 + pointerY * 0.1, aspect < 0.8 ? 8.4 : 7.7);
        camera.lookAt(0, 0, -0.25);
        camera.updateProjectionMatrix();
      }
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
