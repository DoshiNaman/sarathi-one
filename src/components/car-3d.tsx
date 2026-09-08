"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
// anti-slop bans "shape" as a symbol name, and it is right — but this one is
// three.js's own class and cannot be renamed upstream. Aliased at the import so
// the name never reaches our code.
// oxlint-disable-next-line anti-slop/no-shape-in-symbol-names
import { Shape as Outline } from "three";

/**
 * The looked-up vehicle, on a turntable.
 *
 * Each car in the fleet has its own model under /public/models. When a record
 * carries no model — or the file fails to load — a generic body built from an
 * extruded profile takes its place, so a missing asset never leaves an empty box.
 *
 * three.js is heavy, so this module is only reached from the check screen.
 */

/** The Khronos sample's display case. The cloth stays — see CLOTH_SOURCE. */
const DIORAMA = new Set(["Glass"]);

/**
 * The red velvet from the Khronos ToyCar sample, reused as the bed under every
 * car. It is what React Bits' demo stands its model on, and it does the job
 * better than a bare plinth: a car needs something to sit on or it floats.
 * Loaded once and cloned, so eight vehicles do not fetch it eight times.
 */
const CLOTH_SOURCE = "/models/toy-car.glb";
let clothPromise: Promise<THREE.Object3D | null> | null = null;

function loadCloth(loader: GLTFLoader) {
  clothPromise ??= new Promise((resolve) => {
    loader.load(
      CLOTH_SOURCE,
      (gltf) => resolve(gltf.scene.getObjectByName("Fabric") ?? null),
      undefined,
      () => resolve(null)
    );
  });
  return clothPromise;
}

// Registration records name a paint, not a hex. Anything unrecognised falls
// back to a neutral so a new record never renders an invisible car.
const PAINT = new Map([
  ["white", 0xeef1f4],
  ["pearl white", 0xf2f4f6],
  ["silver", 0xc3c8ce],
  ["silky silver", 0xc3c8ce],
  ["beige", 0xd9cdb6],
  ["black", 0x23262b],
  ["aurora black", 0x1f2329],
  ["red", 0xc62b34],
  ["fiery red", 0xd12b31],
  ["golden brown", 0x9a6f3c],
  ["foliage green", 0x3f5f4a],
]);

function paintOf(colour: string) {
  return PAINT.get(colour.trim().toLowerCase()) ?? 0xb9bec6;
}

/** Side-view silhouette, extruded across the car's width. */
function carBody(paint: number) {
  const sideProfile = new Outline();
  sideProfile.moveTo(-2.0, 0.12);
  sideProfile.lineTo(-2.02, 0.52);
  sideProfile.quadraticCurveTo(-1.9, 0.82, -1.45, 0.86);
  sideProfile.lineTo(-1.02, 0.88);
  sideProfile.quadraticCurveTo(-0.62, 1.5, -0.2, 1.56);
  sideProfile.lineTo(0.62, 1.55);
  sideProfile.quadraticCurveTo(1.12, 1.45, 1.42, 0.88);
  sideProfile.lineTo(1.86, 0.86);
  sideProfile.quadraticCurveTo(2.04, 0.78, 2.04, 0.5);
  sideProfile.lineTo(2.0, 0.12);
  sideProfile.closePath();

  const geometry = new THREE.ExtrudeGeometry(sideProfile, {
    depth: 1.72,
    bevelEnabled: true,
    bevelSize: 0.09,
    bevelThickness: 0.09,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geometry.center();

  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: paint, metalness: 0.55, roughness: 0.34 })
  );
}

function wheel() {
  const geometry = new THREE.CylinderGeometry(0.42, 0.42, 0.26, 28);
  geometry.rotateX(Math.PI / 2);
  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0x14161a, metalness: 0.3, roughness: 0.8 })
  );
}

/** Drop a loaded model onto the turntable at a sane size, wherever its origin is. */
function fit(model: THREE.Object3D, span = 3.4) {
  // Cameras, lights and the sample file's case belong to the file, not our scene.
  for (const extra of model.children.slice()) {
    const furniture = extra instanceof THREE.Camera || extra instanceof THREE.Light;
    if (furniture || DIORAMA.has(extra.name)) model.remove(extra);
  }

  model.updateWorldMatrix(true, true);

  // Measure each mesh separately. Downloaded car models almost always ship a
  // ground plane or shadow catcher, and it dwarfs the car — measuring the scene
  // as a whole scaled a Honda City down to a speck on a huge grey floor.
  const parts: { mesh: THREE.Mesh; box: THREE.Box3; size: THREE.Vector3 }[] = [];
  model.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.geometry.computeBoundingBox();
    if (!o.geometry.boundingBox) return;
    const box = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
    parts.push({ mesh: o, box, size: box.getSize(new THREE.Vector3()) });
  });
  if (parts.length === 0) return;

  // A ground plane is flat and as wide as the whole scene. No part of a car is.
  const widest = Math.max(...parts.map((p) => Math.max(p.size.x, p.size.z)));
  const keep = parts.filter((p) => {
    const footprint = Math.max(p.size.x, p.size.z);
    const isFloor = p.size.y < footprint * 0.02 && footprint > widest * 0.7;
    if (isFloor) p.mesh.removeFromParent();
    return !isFloor;
  });
  if (keep.length === 0) return;

  const box = new THREE.Box3();
  for (const p of keep) {
    p.mesh.castShadow = true;
    box.union(p.box);
  }

  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const scale = span / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.set(-centre.x * scale, -box.min.y * scale - 0.62, -centre.z * scale);
}

export default function Car3D({
  colour,
  label,
  modelUrl,
}: {
  colour: string;
  label: string;
  modelUrl?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4.5, 2.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    // setSize is called with updateStyle=false so it only touches the drawing
    // buffer; without these the canvas keeps its default 300x150 CSS box.
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    // Turntable: everything that spins lives on this, so the plinth and the car
    // rotate together and the lights stay put.
    const turntable = new THREE.Group();
    scene.add(turntable);

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 3.1, 0.18, 72),
      new THREE.MeshStandardMaterial({ color: 0x101216, metalness: 0.75, roughness: 0.25 })
    );
    plinth.position.y = -0.81;
    plinth.receiveShadow = true;
    turntable.add(plinth);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.12, 0.022, 12, 96),
      new THREE.MeshBasicMaterial({ color: 0x7624f4 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.72;
    turntable.add(ring);

    const body = carBody(paintOf(colour));
    // Lifted so the wheels sit proud of the sills instead of inside them.
    body.position.y = 0.2;
    body.castShadow = true;

    // A dark band through the cabin. Without it the extrusion reads as a loaf;
    // one glass strip is what makes the eye say "car".
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.46, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x0d1014, metalness: 0.4, roughness: 0.12 })
    );
    glass.position.set(0.19, 0.36, 0);
    body.add(glass);
    turntable.add(body);

    const wheels = [
      [-1.24, 0.86],
      [-1.24, -0.86],
      [1.24, 0.86],
      [1.24, -0.86],
    ].map(([x, z]) => {
      const w = wheel();
      w.position.set(x, -0.3, z);
      w.castShadow = true;
      turntable.add(w);
      return w;
    });

    let disposed = false;

    if (modelUrl) {
      // The models are meshopt-compressed — 276 MB of downloads became 16 MB.
      // The decoder is a single module, so nothing extra has to be served.
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        modelUrl,
        async (gltf) => {
          if (disposed) return;
          fit(gltf.scene);
          turntable.add(gltf.scene);
          body.visible = false;
          for (const w of wheels) w.visible = false;

          const fabric = await loadCloth(loader);
          if (!fabric || disposed) return;
          const bed = fabric.clone();
          const size = new THREE.Box3().setFromObject(bed).getSize(new THREE.Vector3());
          bed.scale.setScalar(5.4 / Math.max(size.x, size.z));
          bed.position.y = -0.72;
          bed.traverse((o) => {
            if (o instanceof THREE.Mesh) o.receiveShadow = true;
          });
          turntable.add(bed);
        },
        undefined,
        () => {
          /* the generic body stays */
        }
      );
    }

    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a1c22, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 24;
    scene.add(key);

    // Two rims in the app's own pair — grape and volt. The identity is a prism
    // splitting one beam, and this is the same idea in light on a real surface.
    const grape = new THREE.PointLight(0x7624f4, 26, 22);
    grape.position.set(-4.5, 2.4, -4);
    scene.add(grape);
    const volt = new THREE.PointLight(0xc8ff00, 14, 18);
    volt.position.set(4.2, 1.4, -3.6);
    scene.add(volt);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 12;
    // Never let the camera go under the plinth — from below it is a hollow shell.
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2.15;

    // Idle spin is decoration. Someone who has asked for less motion, or who has
    // taken hold of the model themselves, should not be fighting it.
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dragging = false;
    const hold = () => (dragging = true);
    const release = () => (dragging = false);
    controls.addEventListener("start", hold);
    controls.addEventListener("end", release);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!dragging && !stillness.matches) turntable.rotation.y += 0.0035;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener("start", hold);
      controls.removeEventListener("end", release);
      controls.dispose();
      // WebGL resources are not garbage collected with the React tree.
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [colour, modelUrl]);

  return (
    <div
      ref={host}
      className="h-full w-full"
      role="img"
      aria-label={`Interactive 3D model of ${label}, in ${colour}. Decorative — for illustration, not the actual vehicle.`}
    />
  );
}
