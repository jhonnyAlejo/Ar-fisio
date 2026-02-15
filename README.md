# Prototipo AR educativo: pectoral mayor vs caja torácica

Este prototipo usa **Three.js + AR.js (A-Frame)** para visualizar en realidad aumentada la proporción anatómica entre:

- Músculo pectoral mayor (simplificado).
- Esternón, clavículas y costillas (simplificados).

## Objetivos cubiertos

- Referencia anatómica promedio (no personalizada).
- Escalado uniforme por distancia entre dos marcadores AR.
- Proporciones internas constantes sin deformación muscular.
- Modos de visualización: huesos, músculo o ambos.
- Controles de rotación y zoom uniforme.
- Métricas de rendimiento: tiempo de detección, FPS y jitter de escala.

## Estructura

```text
.
├── index.html
├── src
│   ├── main.js
│   ├── styles.css
│   ├── ar
│   │   ├── arInitializer.js
│   │   └── markerTracker.js
│   ├── models
│   │   ├── anatomyFactory.js
│   │   └── modelLoader.js
│   ├── scaling
│   │   └── uniformScaler.js
│   ├── ui
│   │   ├── cameraControls.js
│   │   └── viewModeController.js
│   └── performance
│       └── performanceMonitor.js
└── assets
    └── models
```

## Ejecución

1. Levanta servidor local:

```bash
python -m http.server 8080
```

2. Abre en móvil (misma red):

```text
http://TU_IP_LOCAL:8080
```

3. Imprime/usa marcadores AR.js:
   - Superior: `hiro`
   - Inferior: `kanji`

## Mapeo de módulos

- `src/ar/arInitializer.js`: obtiene y valida nodos de escena AR.
- `src/ar/markerTracker.js`: visibilidad + distancia entre marcadores.
- `src/scaling/uniformScaler.js`: aplica escala uniforme al modelo 3D.
- `src/models/anatomyFactory.js`: construye geometría simplificada o carga GLTF opcional.
- `src/models/modelLoader.js`: carga modelos GLTF/GLB de referencia.
- `src/ui/viewModeController.js`: alterna modos (huesos/músculo/ambos).
- `src/ui/cameraControls.js`: rotación y zoom del modelo.
- `src/performance/performanceMonitor.js`: FPS, tiempo detección y estabilidad.
- `src/main.js`: orquestación general y bucle de actualización.

## Uso con GLB anatómico real (opcional)

1. Copia archivos en `assets/models/`.
2. Actualiza en `src/main.js`:

```js
const MODEL_CONFIG = {
  bonesModelPath: './assets/models/chest_bones_average.glb',
  muscleModelPath: './assets/models/pectoralis_major_average.glb',
};
```

> Se recomienda mantener modelos de referencia educativos con proporciones promedio poblacionales.

## Nota sobre warning `useLegacyLights`

En algunas combinaciones de **A-Frame + AR.js + Three.js** puede aparecer en consola:

`THREE.WebGLRenderer: The property .useLegacyLights has been deprecated...`

Ese mensaje proviene de dependencias de render (no de la lógica anatómica). El prototipo incluye un filtro puntual para ese warning y mantiene el resto de advertencias visibles para depuración normal.
