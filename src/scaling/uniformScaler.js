const THREE = window.THREE;

/**
 * Escalador uniforme basado en distancia entre marcadores.
 * Mantiene proporciones internas del modelo anatómico.
 */
export class UniformScaler {
  constructor({ modelGroup, referenceDistance = 0.32, minScale = 0.35, maxScale = 2.4 }) {
    this.modelGroup = modelGroup;
    this.referenceDistance = referenceDistance;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.userZoom = 1;
  }

  setUserZoom(zoom) {
    this.userZoom = THREE.MathUtils.clamp(zoom, 0.45, 2.5);
  }

  updateFromMarkerDistance(markerDistanceMeters) {
    if (!markerDistanceMeters) return null;

    const rawScale = markerDistanceMeters / this.referenceDistance;
    const scaled = THREE.MathUtils.clamp(rawScale * this.userZoom, this.minScale, this.maxScale);
    this.modelGroup.scale.setScalar(scaled);
    return scaled;
  }
}
