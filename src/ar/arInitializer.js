/**
 * Inicializa y valida referencias AR de la escena.
 */
export function initARScene() {
  const scene = document.querySelector('#ar-scene');
  const markerTop = document.querySelector('#marker-top');
  const markerBottom = document.querySelector('#marker-bottom');
  const anatomyRoot = document.querySelector('#anatomy-root');

  if (!scene || !markerTop || !markerBottom || !anatomyRoot) {
    throw new Error('No se encontraron los nodos AR requeridos en index.html');
  }

  return {
    scene,
    markerTop,
    markerBottom,
    anatomyRoot,
  };
}
