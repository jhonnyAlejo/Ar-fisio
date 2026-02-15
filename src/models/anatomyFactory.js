import { loadOptionalGLTF } from './modelLoader.js';

const THREE = window.THREE;

const BONE_COLOR = '#ddd7c7';
const MUSCLE_COLOR = '#ca4b4b';

function makeMaterial(color, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    roughness: 0.65,
    metalness: 0.08,
  });
}

function buildSimplifiedBonesGroup() {
  const group = new THREE.Group();
  group.name = 'bones-group';

  const sternum = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.32, 0.04),
    makeMaterial(BONE_COLOR),
  );
  sternum.position.set(0, 0, 0);
  sternum.name = 'sternum';
  group.add(sternum);

  const clavicleGeometry = new THREE.CapsuleGeometry(0.015, 0.18, 8, 16);
  const clavicleL = new THREE.Mesh(clavicleGeometry, makeMaterial(BONE_COLOR));
  clavicleL.position.set(-0.13, 0.16, 0.02);
  clavicleL.rotation.z = Math.PI / 2.8;
  const clavicleR = clavicleL.clone();
  clavicleR.position.x *= -1;
  clavicleR.rotation.z *= -1;

  clavicleL.name = 'clavicle-left';
  clavicleR.name = 'clavicle-right';
  group.add(clavicleL, clavicleR);

  const ribGeometry = new THREE.TorusGeometry(0.19, 0.009, 8, 48, Math.PI);
  for (let i = 0; i < 6; i += 1) {
    const rib = new THREE.Mesh(ribGeometry, makeMaterial(BONE_COLOR, 0.95));
    rib.rotation.x = Math.PI / 2;
    rib.position.y = 0.1 - i * 0.06;
    rib.scale.x = 1 + i * 0.04;
    rib.name = `rib-${i + 1}`;
    group.add(rib);
  }

  return group;
}

function buildSimplifiedPectoralGroup() {
  const group = new THREE.Group();
  group.name = 'muscle-group';

  const geometry = new THREE.SphereGeometry(0.19, 24, 24, 0, Math.PI);
  const pectoralLeft = new THREE.Mesh(geometry, makeMaterial(MUSCLE_COLOR, 0.82));
  pectoralLeft.scale.set(1, 0.62, 0.42);
  pectoralLeft.position.set(-0.11, 0.02, 0.07);
  pectoralLeft.rotation.set(Math.PI / 2, Math.PI / 2.4, 0);

  const pectoralRight = pectoralLeft.clone();
  pectoralRight.position.x *= -1;
  pectoralRight.rotation.y *= -1;

  pectoralLeft.name = 'pectoralis-major-left';
  pectoralRight.name = 'pectoralis-major-right';

  group.add(pectoralLeft, pectoralRight);
  return group;
}

/**
 * Construye el modelo anatómico en proporciones promedio.
 * Permite reemplazar huesos/músculo por GLTF si se especifica en config.
 */
export async function createAnatomyModel(config = {}) {
  const root = new THREE.Group();
  root.name = 'anatomy-model';

  const bones = (await loadOptionalGLTF(config.bonesModelPath)) ?? buildSimplifiedBonesGroup();
  const muscle = (await loadOptionalGLTF(config.muscleModelPath)) ?? buildSimplifiedPectoralGroup();

  bones.name = 'bones';
  muscle.name = 'muscle';

  root.add(bones, muscle);

  const light = new THREE.DirectionalLight(0xffffff, 0.85);
  light.position.set(0.4, 1, 0.5);
  root.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  return { root, bones, muscle };
}
