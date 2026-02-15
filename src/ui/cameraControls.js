/**
 * Controles básicos para rotación + zoom uniforme.
 */
export function setupModelControls({ modelGroup, scaler }) {
  let zoom = 1;

  const rotateStep = Math.PI / 18;
  const zoomStep = 0.1;

  const rotateLeft = document.querySelector('#rotate-left');
  const rotateRight = document.querySelector('#rotate-right');
  const zoomIn = document.querySelector('#zoom-in');
  const zoomOut = document.querySelector('#zoom-out');
  const reset = document.querySelector('#reset-view');

  rotateLeft?.addEventListener('click', () => {
    modelGroup.rotation.y += rotateStep;
  });

  rotateRight?.addEventListener('click', () => {
    modelGroup.rotation.y -= rotateStep;
  });

  zoomIn?.addEventListener('click', () => {
    zoom += zoomStep;
    scaler.setUserZoom(zoom);
  });

  zoomOut?.addEventListener('click', () => {
    zoom -= zoomStep;
    scaler.setUserZoom(zoom);
  });

  reset?.addEventListener('click', () => {
    zoom = 1;
    scaler.setUserZoom(zoom);
    modelGroup.rotation.set(0, 0, 0);
  });
}
