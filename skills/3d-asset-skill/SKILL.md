---
name: 3d-asset-generator
description: Generate a 3D asset from a text description or reference image. Use this skill any time the user wants a 3D object, 3D scene, 3D model preview, or anything that should spin, be lit, or feel volumetric — even if they say things like "make that 3D", "can you render this", "I want a spinning logo", "show me a 3D version", "generate a glass orb", "build a 3D icon", or "make a product mockup". Output is always a single self-contained HTML file using Three.js. No build step, no install — opens straight in the browser with orbit controls and a live-edit panel baked in.
---

# 3d-asset-generator

> Input: a text description ("a glowing crystal orb") or a reference image of a shape/object.
> Output: a **single self-contained HTML file** — Three.js renders the 3D asset in a canvas with orbit controls, and a floating live-edit panel lets the user change geometry, material, lighting, and animation without touching code.
> No frameworks, no build step, no install. Open the file in Chrome and it works.

---

## 0. DECLARING THE ASSET READ

Before writing any code, output one line:

> **"Building: [asset name] — [geometry type], [material style], [dominant color/finish], [lighting mood]."**

Example:
> *"Building: crystal orb — sphere geometry, glass/transparent material, cyan tint, dark studio lighting."*

If the input is ambiguous (just "make it 3D" with no other context), ask one question: *"What object or shape should I build?"*

---

## 1. REFERENCE ANALYSIS

When a reference image is provided, read it for:

- **Shape family** — is this closest to a sphere, box, cylinder, torus, cone, plane, or a compound/custom shape?
- **Surface finish** — matte, glossy, metallic, glass, emissive/glowing, rough stone, smooth plastic?
- **Color palette** — dominant color, secondary color, any glow/emission color?
- **Scale proportions** — is it tall, wide, cube-like, thin, chunky?
- **Lighting mood** — is the reference bright and clean, dark and dramatic, soft and ambient, neon-lit?

Map those reads directly to Three.js geometry + material choices below. Do not invent a different aesthetic than what the reference shows.

---

## 2. GEOMETRY SELECTION GUIDE

Pick the geometry that best matches the shape. Use these Three.js constructors:

| Shape | Constructor | Good for |
|---|---|---|
| Sphere | `SphereGeometry(1, 64, 64)` | Orbs, balls, planets, bubbles |
| Box | `BoxGeometry(1, 1, 1)` | Cubes, blocks, packages, icons |
| Cylinder | `CylinderGeometry(0.5, 0.5, 1.5, 64)` | Cans, pillars, coins, capsules |
| Torus | `TorusGeometry(0.7, 0.3, 32, 100)` | Rings, donuts, loops |
| Torus Knot | `TorusKnotGeometry(0.6, 0.2, 200, 20)` | Complex organic shapes, abstract |
| Cone | `ConeGeometry(0.6, 1.5, 64)` | Spikes, mountains, gems |
| Icosahedron | `IcosahedronGeometry(1, 0)` | Low-poly gems, crystals, dice |
| Octahedron | `OctahedronGeometry(1, 0)` | Diamonds, faceted gems |
| Dodecahedron | `DodecahedronGeometry(1, 0)` | Abstract solids |
| Plane | `PlaneGeometry(2, 2, 32, 32)` | Surfaces, cards, banners |

For compound shapes (e.g., a rocket, a logo), use `THREE.Group` and combine multiple geometries.

---

## 3. MATERIAL SELECTION GUIDE

Always use `MeshStandardMaterial` as the base — it responds to lights and gives physically accurate results. Only deviate when the material type truly calls for it.

### Material presets

**Standard (matte plastic):**
```js
new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.6, metalness: 0.0 })
```

**Metallic:**
```js
new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.1, metalness: 1.0 })
```

**Glass / transparent:**
```js
new THREE.MeshPhysicalMaterial({
  color: 0x88ccff, roughness: 0.0, metalness: 0.0,
  transmission: 0.95, thickness: 1.5, ior: 1.5,
  transparent: true, opacity: 0.85
})
```

**Emissive / glowing:**
```js
new THREE.MeshStandardMaterial({
  color: 0x000000, emissive: 0x6366f1, emissiveIntensity: 2.0,
  roughness: 0.3, metalness: 0.0
})
```

**Wireframe:**
```js
new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true })
```

**Phong (classic shiny):**
```js
new THREE.MeshPhongMaterial({ color: 0x6366f1, shininess: 120, specular: 0xffffff })
```

Never use `MeshBasicMaterial` (except for wireframe) — it ignores lights and looks flat.

---

## 4. LIGHTING SETUP

Lighting is what separates a professional-looking 3D asset from a gray blob. Always use at least three lights.

### Lighting presets

**Studio (clean product photography):**
```js
// Key light
const key = new THREE.DirectionalLight(0xffffff, 2.0)
key.position.set(5, 8, 5)
key.castShadow = true
scene.add(key)
// Fill light
const fill = new THREE.DirectionalLight(0x8888ff, 0.5)
fill.position.set(-5, 2, -3)
scene.add(fill)
// Ambient
scene.add(new THREE.AmbientLight(0xffffff, 0.3))
```

**Dark / dramatic:**
```js
const spot = new THREE.SpotLight(0xffffff, 3.0)
spot.position.set(3, 6, 3)
spot.angle = 0.4
spot.penumbra = 0.3
spot.castShadow = true
scene.add(spot)
const rim = new THREE.DirectionalLight(0x4444ff, 0.8)
rim.position.set(-4, 1, -4)
scene.add(rim)
scene.add(new THREE.AmbientLight(0x111122, 0.2))
```

**Outdoor (warm sun):**
```js
const sun = new THREE.DirectionalLight(0xffe4b5, 2.5)
sun.position.set(8, 10, 4)
sun.castShadow = true
scene.add(sun)
const sky = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.6)
scene.add(sky)
```

**Neon / colored:**
```js
const p1 = new THREE.PointLight(0x6366f1, 3.0, 10)
p1.position.set(3, 2, 3)
scene.add(p1)
const p2 = new THREE.PointLight(0xa78bfa, 2.0, 8)
p2.position.set(-3, -1, -2)
scene.add(p2)
scene.add(new THREE.AmbientLight(0x0a0a1a, 0.5))
```

### Shadows
Always enable shadows on the renderer and the key light:
```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```
Add a subtle shadow-receiving plane below the object:
```js
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.ShadowMaterial({ opacity: 0.15 })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -1.2
floor.receiveShadow = true
scene.add(floor)
```

---

## 5. CAMERA & RENDERER SETUP

```js
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100)
camera.position.set(0, 0.5, 3.5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(canvas.clientWidth, canvas.clientHeight)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputColorSpace = THREE.SRGBColorSpace
```

Use `OrbitControls` via CDN import map so the user can rotate, zoom, and pan with mouse/touch:
```js
controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.minDistance = 1.5
controls.maxDistance = 8
controls.autoRotate = true
controls.autoRotateSpeed = 1.5
```

Handle canvas resize:
```js
window.addEventListener('resize', () => {
  const w = canvas.clientWidth, h = canvas.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
})
```

---

## 6. ANIMATION LOOP

Auto-rotate is on by default (handled by `OrbitControls.autoRotate`). The animation loop:

```js
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  // Optional: pulse emissive intensity for glowing materials
  if (mesh.material.emissiveIntensity !== undefined && glowPulse) {
    mesh.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.002) * 0.5
  }
  renderer.render(scene, camera)
}
animate()
```

---

## 7. THE LIVE EDIT PANEL

Same dark-glass style as image-to-ui. Floating on the right, toggle tab on the left edge.

### Design tokens for the panel itself (hardcoded — panel doesn't edit itself)
```css
#edit-panel {
  position: fixed; right: 0; top: 50%; transform: translateY(-50%);
  width: 260px;
  background: rgba(12, 12, 18, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-right: none;
  border-radius: 16px 0 0 16px;
  box-shadow: -8px 0 40px rgba(0,0,0,0.5);
  overflow-y: auto; max-height: 90vh;
  font-family: system-ui, sans-serif;
  font-size: 12px; color: #ccc;
  padding: 16px;
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 100;
}
#edit-panel.collapsed { transform: translateY(-50%) translateX(260px); }
#panel-toggle {
  position: absolute; left: -36px; top: 50%; transform: translateY(-50%);
  width: 36px; height: 44px;
  background: rgba(12, 12, 18, 0.92);
  border: 1px solid rgba(255,255,255,0.08); border-right: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer; color: #ccc; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
}
```

### Controls to include

Build the panel from a `CONTROLS` array (same pattern as image-to-ui):

```js
const CONTROLS = [
  // GEOMETRY
  { type: 'select', label: 'Geometry', section: 'GEOMETRY', id: 'geo',
    options: ['Sphere','Box','Cylinder','Torus','Torus Knot','Cone','Icosahedron','Octahedron'] },
  { type: 'range', label: 'Scale X', section: 'GEOMETRY', id: 'scaleX', min: 0.1, max: 3, step: 0.05, value: 1 },
  { type: 'range', label: 'Scale Y', section: 'GEOMETRY', id: 'scaleY', min: 0.1, max: 3, step: 0.05, value: 1 },
  { type: 'range', label: 'Scale Z', section: 'GEOMETRY', id: 'scaleZ', min: 0.1, max: 3, step: 0.05, value: 1 },

  // MATERIAL
  { type: 'select', label: 'Material', section: 'MATERIAL', id: 'mat',
    options: ['Standard','Metallic','Glass','Emissive','Wireframe','Phong'] },
  { type: 'color',  label: 'Color',       section: 'MATERIAL', id: 'color',     value: '#6366f1' },
  { type: 'range',  label: 'Roughness',   section: 'MATERIAL', id: 'roughness', min: 0, max: 1, step: 0.01, value: 0.4 },
  { type: 'range',  label: 'Metalness',   section: 'MATERIAL', id: 'metalness', min: 0, max: 1, step: 0.01, value: 0 },
  { type: 'color',  label: 'Emissive',    section: 'MATERIAL', id: 'emissive',  value: '#000000' },
  { type: 'range',  label: 'Emissive Int',section: 'MATERIAL', id: 'emissiveInt', min: 0, max: 5, step: 0.1, value: 0 },

  // LIGHTING
  { type: 'select', label: 'Environment', section: 'LIGHTING', id: 'env',
    options: ['Studio','Dark','Outdoor','Neon'] },
  { type: 'color',  label: 'Light Color', section: 'LIGHTING', id: 'lightColor', value: '#ffffff' },
  { type: 'range',  label: 'Light Intensity', section: 'LIGHTING', id: 'lightInt', min: 0, max: 5, step: 0.1, value: 2.0 },

  // ANIMATION
  { type: 'toggle', label: 'Auto Rotate', section: 'ANIMATION', id: 'autoRotate', value: true },
  { type: 'range',  label: 'Rotate Speed', section: 'ANIMATION', id: 'rotateSpeed', min: 0, max: 5, step: 0.1, value: 1.5 },
  { type: 'toggle', label: 'Glow Pulse',  section: 'ANIMATION', id: 'glowPulse', value: false },
]
```

Wire each control so changes update the live scene immediately:
- Geometry change → dispose old geometry, create new one, reassign to `mesh.geometry`
- Material change → dispose old material, create new preset, reassign to `mesh.material`
- Color change → `mesh.material.color.set(value)`
- Roughness/Metalness → `mesh.material.roughness = value` + `mesh.material.needsUpdate = true`
- Scale → `mesh.scale.set(scaleX, scaleY, scaleZ)`
- Auto Rotate → `controls.autoRotate = value`
- Rotate Speed → `controls.autoRotateSpeed = value`
- Environment → call `setEnvironment(preset)` which rebuilds the lights
- Light Color/Intensity → find the key light by name and update it

### Export GLB button

At the bottom of the panel:
```html
<button id="export-btn">↓ Export GLB</button>
```

```js
import { GLTFExporter } from 'https://unpkg.com/three@0.160.0/examples/jsm/exporters/GLTFExporter.js'

document.getElementById('export-btn').addEventListener('click', () => {
  const exporter = new GLTFExporter()
  exporter.parse(mesh, (gltf) => {
    const blob = new Blob([gltf], { type: 'application/octet-stream' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'asset.glb'
    a.click()
  }, (err) => console.error(err), { binary: true })
})
```

---

## 8. OUTPUT STRUCTURE

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Asset name]</title>
  <style>
    /* Reset + body fills viewport */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a12; overflow: hidden; width: 100vw; height: 100vh; }
    canvas { display: block; width: 100%; height: 100%; }
    /* Panel styles */
    /* ... (full panel CSS) ... */
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <div id="edit-panel">
    <button id="panel-toggle">⚙</button>
    <div id="panel-body">
      <div class="panel-header">3D Edit</div>
      <!-- JS builds controls here -->
      <button id="export-btn">↓ Export GLB</button>
    </div>
  </div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <script type="module">
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
    import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

    // === SCENE SETUP ===
    const canvas = document.getElementById('canvas')
    const scene = new THREE.Scene()
    // camera, renderer, controls setup...

    // === ASSET ===
    // geometry + material + mesh...

    // === LIGHTING ===
    // setEnvironment('Studio')...

    // === PANEL ===
    // build from CONTROLS array, wire listeners...

    // === ANIMATION LOOP ===
    function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
    animate()
  </script>
</body>
</html>
```

Use `type="importmap"` + `type="module"` — this is the correct way to use Three.js from CDN without a build step in modern browsers.

---

## 9. QUALITY GATES

Before finalizing, check every item:

- [ ] File opens in Chrome with zero console errors
- [ ] Asset is visible and lit — not a dark silhouette, not a flat gray blob
- [ ] Orbit controls work: left drag rotates, right drag pans, scroll zooms
- [ ] Auto-rotate is on by default and visible
- [ ] Shadow appears below the object on the floor plane
- [ ] Panel toggle tab shows ⚙ when closed, ✕ when open
- [ ] Geometry dropdown rebuilds the shape live without page reload
- [ ] Material dropdown switches material presets live
- [ ] Color picker changes object color live
- [ ] Roughness + Metalness sliders visibly change the surface
- [ ] Export GLB button triggers a download
- [ ] Panel is scrollable if controls overflow

---

## 10. ANTI-PATTERNS — NEVER DO THESE

- **Never use `MeshBasicMaterial`** (except wireframe) — it ignores lights.
- **Never leave the background pure black with no ambient light** — the object disappears.
- **Never skip shadows** — a floating object with no ground shadow looks fake.
- **Never use `<script src="...three.min.js">` tags** with ES module imports — they conflict. Use the importmap pattern exclusively.
- **Never make all sliders update via `needsUpdate`** without also disposing old materials when switching types — it causes memory leaks.
- **Never use pixel-art or low-segment geometries** unless the reference explicitly shows a low-poly style (e.g., `SphereGeometry(1, 8, 8)` — always use high segment counts for smooth objects).
- **Never skip OrbitControls damping** — without it the rotation feels cheap and snappy.
- **Never make the panel block the center of the canvas** — it lives on the right edge only.
