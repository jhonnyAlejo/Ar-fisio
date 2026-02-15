import { initARScene } from './ar/arInitializer.js';
import { createAnatomyModel } from './models/anatomyFactory.js';
import { MarkerTracker } from './ar/markerTracker.js';
import { UniformScaler } from './scaling/uniformScaler.js';
import { setupViewModeController } from './ui/viewModeController.js';
import { setupModelControls } from './ui/cameraControls.js';
import { PerformanceMonitor } from './performance/performanceMonitor.js';

const THREE = window.THREE;

const MODEL_CONFIG = {
  // Opcional: reemplazar por GLB de referencia anatómica promedio.
  bonesModelPath: '',
  muscleModelPath: '',
};

async function bootstrap() {
  const { scene, markerTop, markerBottom, anatomyRoot } = initARScene();
  const { root, bones, muscle } = await createAnatomyModel(MODEL_CONFIG);

  const root3D = anatomyRoot.object3D;
  root3D.add(root);

  const tracker = new MarkerTracker(markerTop, markerBottom);
  const scaler = new UniformScaler({
    modelGroup: root,
    referenceDistance: 0.30, // referencia media sup-esternón inferior
    minScale: 0.35,
    maxScale: 2.4,
  });

  setupViewModeController({ bonesGroup: bones, muscleGroup: muscle });
  setupModelControls({ modelGroup: root, scaler });

  const perfPanel = document.querySelector('#perf-panel');
  const perf = new PerformanceMonitor(perfPanel);

  const midpoint = new THREE.Vector3();
  const topQuat = new THREE.Quaternion();

  const tick = () => {
    const data = tracker.computeDistanceMeters();
    let currentScale = null;

    if (data) {
      midpoint.copy(data.top).add(data.bottom).multiplyScalar(0.5);

      // Suavizado para reducir jitter de rastreo.
      root3D.position.lerp(midpoint, 0.35);
      markerTop.object3D.getWorldQuaternion(topQuat);
      root3D.quaternion.slerp(topQuat, 0.2);

      currentScale = scaler.updateFromMarkerDistance(data.distance);
      root3D.visible = true;
    } else {
      root3D.visible = false;
    }

    perf.update({
      detectionMs: tracker.lastDetectionDurationMs,
      currentScale,
      distance: data?.distance ?? null,
    });

    requestAnimationFrame(tick);
  };

  scene.addEventListener('loaded', () => {
    requestAnimationFrame(tick);
  });
}

bootstrap().catch((error) => {
  console.error('Error inicializando AR prototipo:', error);
  const perfPanel = document.querySelector('#perf-panel');
  if (perfPanel) {
    perfPanel.textContent = `Error de inicialización:\n${error.message}`;
  }
});
