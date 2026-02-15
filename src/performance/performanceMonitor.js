/**
 * Métricas: FPS, tiempo de detección y estabilidad de render.
 */
export class PerformanceMonitor {
  constructor(panelEl) {
    this.panelEl = panelEl;
    this.lastFrameTime = performance.now();
    this.fps = 0;
    this.frameTimes = [];
    this.lastScale = 1;
    this.scaleJitter = 0;
  }

  update({ detectionMs, currentScale, distance }) {
    const now = performance.now();
    const dt = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const instantFps = dt > 0 ? 1000 / dt : 0;
    this.fps = this.fps * 0.9 + instantFps * 0.1;

    if (currentScale) {
      const deltaScale = Math.abs(currentScale - this.lastScale);
      this.scaleJitter = this.scaleJitter * 0.85 + deltaScale * 0.15;
      this.lastScale = currentScale;
    }

    this.frameTimes.push(dt);
    if (this.frameTimes.length > 120) this.frameTimes.shift();
    const avgFrame = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;

    if (this.panelEl) {
      this.panelEl.textContent = [
        `FPS estimado: ${this.fps.toFixed(1)}`,
        `Frame promedio (120): ${avgFrame.toFixed(2)} ms`,
        `Detección marcadores: ${detectionMs.toFixed(3)} ms`,
        `Distancia marcadores: ${distance ? distance.toFixed(3) : '--'} m`,
        `Escala uniforme: ${currentScale ? currentScale.toFixed(3) : '--'}`,
        `Jitter de escala: ${this.scaleJitter.toFixed(5)}`,
      ].join('\n');
    }
  }
}
