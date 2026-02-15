const THREE = window.THREE;

/**
 * Encapsula detección de marcadores y distancia entre ellos.
 */
export class MarkerTracker {
  constructor(markerTopEl, markerBottomEl) {
    this.markerTopEl = markerTopEl;
    this.markerBottomEl = markerBottomEl;
    this.tmpTop = new THREE.Vector3();
    this.tmpBottom = new THREE.Vector3();
    this.lastDetectionDurationMs = 0;
  }

  isMarkerVisible(markerEl) {
    return markerEl.object3D.visible;
  }

  computeDistanceMeters() {
    const start = performance.now();

    const topVisible = this.isMarkerVisible(this.markerTopEl);
    const bottomVisible = this.isMarkerVisible(this.markerBottomEl);

    if (!topVisible || !bottomVisible) {
      this.lastDetectionDurationMs = performance.now() - start;
      return null;
    }

    this.markerTopEl.object3D.getWorldPosition(this.tmpTop);
    this.markerBottomEl.object3D.getWorldPosition(this.tmpBottom);
    const distance = this.tmpTop.distanceTo(this.tmpBottom);

    this.lastDetectionDurationMs = performance.now() - start;
    return {
      distance,
      top: this.tmpTop.clone(),
      bottom: this.tmpBottom.clone(),
    };
  }
}
