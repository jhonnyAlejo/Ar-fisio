const { GLTFLoader } = window.THREE;

/**
 * Carga modelo GLTF/GLB de referencia.
 * Si no hay ruta definida, retorna null para usar geometría simplificada.
 */
export async function loadOptionalGLTF(path) {
  if (!path || !GLTFLoader) return null;

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(path);
  return gltf.scene;
}
