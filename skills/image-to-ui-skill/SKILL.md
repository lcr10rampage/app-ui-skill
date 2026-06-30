---
name: image-to-ui
description: Give this skill a reference image of any app screen, website, or UI concept. It rebuilds that design in clean HTML/CSS/JS and injects a floating live-edit panel so you can tweak colors, spacing, fonts, radii, and content without touching code or chatting.
---

# image-to-ui: Reference-to-Code with Live Edit Panel

> Input: a reference image (screenshot, mockup, photo, sketch, Dribbble shot, anything).
> Output: a **single self-contained HTML file** — the rebuilt screen + a floating control panel that lets the user edit design tokens live.
> No frameworks. No build step. No chat required after generation.

---

## 0. WHAT THIS SKILL DOES

1. **Analyze** the reference image for layout, colors, spacing, typography, shapes, and overall vibe.
2. **Rebuild** it faithfully in HTML + CSS + vanilla JS — clean, semantic, pixel-attentive.
3. **Extract** every visual decision into named design tokens (CSS custom properties).
4. **Inject** a floating live-edit panel that reads those tokens and lets the user tweak them with sliders, color pickers, and dropdowns — changes apply instantly with no reload.

---

## 1. IMAGE ANALYSIS PROTOCOL

Before writing a single line of code, do a silent audit of the reference image across these axes:

### 1.A Color Extraction
- Pull the **exact** dominant background color (don't approximate — squint and pick the truest hex).
- Pull primary accent, secondary accent, text color, muted/subtle text color, border/divider color.
- Note: is it dark-mode, light-mode, or a gradient-heavy design?
- Flag any gradients: capture start + end color and direction angle.

### 1.B Typography Read
- Estimate heading weight (thin/regular/semibold/bold/black) and approximate size ratio between heading and body.
- Estimate body font style: geometric sans, humanist sans, serif, mono.
- Note letter-spacing (tight / normal / wide / very wide uppercase tracking).
- Note line-height density (compact / comfortable / airy).

### 1.C Spacing & Radius Read
- Estimate the dominant border-radius vibe: sharp (0–2px), soft (8–12px), rounded (16–24px), pill (9999px).
- Estimate card/container padding (tight ~12px, normal ~20px, generous ~32px+).
- Estimate gap between elements (dense / comfortable / loose).

### 1.D Layout Structure
- Identify the top-level structure: single column, split/two-column, grid, stacked cards, tab-based, list-based.
- Identify the navigation pattern if present: top nav, bottom tab bar, sidebar, none.
- Identify the hero or primary focal element.
- List all distinct sections or modules in reading order (top to bottom, left to right).

### 1.E Motion Signals
- Note any design details that imply motion: shadows suggesting lift, arrows, carousels, progress indicators.
- You will animate these subtly even if the reference is static.

---

## 2. REBUILD RULES

### 2.A Faithfulness Over Creativity
Your job here is to **match the reference**, not improve it. Reproduce layout, proportions, color, and component shapes as closely as possible. Do NOT substitute your own aesthetic judgment unless a reference detail is technically impossible.

Exception: if the reference has obvious placeholder content (lorem ipsum, gray boxes, blurry text), you fill those with believable real content that fits the design's context.

### 2.B Single HTML File — Strict Requirements
- All CSS must be in a `<style>` block in `<head>`.
- All JS must be in a `<script>` block at end of `<body>`.
- No external dependencies except fonts (Google Fonts `<link>` is allowed).
- Must work by simply opening the file in a browser (no server required).
- Use CSS custom properties (variables) for **every single design token**. This is non-negotiable — it's what makes the live-edit panel work.

### 2.C CSS Custom Property Token Schema
Define all tokens at `:root`. Use this exact naming convention:

```css
:root {
  /* Colors */
  --color-bg:           #0a0a12;
  --color-bg-card:      #13131f;
  --color-bg-elevated:  #1c1c2e;
  --color-accent:       #6366f1;
  --color-accent-2:     #a78bfa;
  --color-text:         #f0f0f8;
  --color-text-muted:   #8888aa;
  --color-border:       #2a2a3e;

  /* Typography */
  --font-family:        'Inter', sans-serif;
  --font-size-base:     16px;
  --font-size-heading:  32px;
  --font-weight-heading: 700;
  --letter-spacing:     -0.02em;
  --line-height:        1.5;

  /* Shape */
  --radius-card:        16px;
  --radius-button:      10px;
  --radius-input:       8px;
  --radius-pill:        9999px;

  /* Spacing */
  --spacing-page:       24px;
  --spacing-card:       20px;
  --spacing-gap:        16px;

  /* Shadow */
  --shadow-card:        0 4px 24px rgba(0,0,0,0.4);
  --shadow-elevated:    0 8px 40px rgba(0,0,0,0.6);

  /* Motion */
  --transition-speed:   0.2s;
  --transition-ease:    cubic-bezier(0.32, 0.72, 0, 1);
}
```

Adjust values to match the reference. Add tokens as needed. Remove tokens that don't apply. But always follow `--category-name` naming.

### 2.D Component Reconstruction
Rebuild each component identified in 1.D with semantic HTML:
- Use `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, `<article>`, `<aside>` correctly.
- Cards use `<div class="card">`, buttons use `<button>`, inputs use `<input>`.
- Never use inline styles — only classes that map to CSS using the token variables.

### 2.E Mobile First
Default viewport: 390px wide (iPhone 15 Pro). The preview frame in the file should look like a phone screen by default.

Add a toggle in the control panel to switch between **Mobile (390px)** and **Desktop (full width)**.

If the reference is a desktop design, start full width. Use judgment.

### 2.F Micro-Animations
Add these always, even if the reference is static:
- Cards: subtle `transform: translateY(-2px)` + shadow deepening on hover, `transition: var(--transition-speed) var(--transition-ease)`.
- Buttons: slight scale-down on `:active` (`transform: scale(0.97)`).
- Any list items: staggered fade-in on load using `animation-delay`.

---

## 3. THE LIVE EDIT PANEL

This is the core output feature. It must be a polished, floating side panel injected into the HTML — not a debug tool, a real UI.

### 3.A Panel Structure

```
┌──────────────────────────────┐
│  ⚙  Live Edit               │
│  ─────────────────────────  │
│  COLORS                      │
│  Background    [████] #0a0a12│
│  Accent        [████] #6366f1│
│  Text          [████] #f0f0f8│
│  Card BG       [████] #13131f│
│  Border        [████] #2a2a3e│
│                              │
│  TYPOGRAPHY                  │
│  Font Size     [──●──] 16px  │
│  Heading Size  [──────●] 32px│
│  Heading Weight [Bold  ▾]    │
│  Letter Spacing [──●──] -0.02│
│  Line Height   [──●──] 1.5   │
│                              │
│  SHAPE                       │
│  Card Radius   [──────●] 16px│
│  Button Radius [────●──] 10px│
│                              │
│  SPACING                     │
│  Page Padding  [───●───] 24px│
│  Card Padding  [────●──] 20px│
│  Gap           [──●────] 16px│
│                              │
│  MOTION                      │
│  Speed         [──●────] 0.2s│
│                              │
│  VIEWPORT                    │
│  [Mobile 390] [Desktop Full] │
│                              │
│  [↓ Export CSS Tokens]       │
└──────────────────────────────┘
```

### 3.B Panel Visual Requirements

The panel itself must look premium:
- Fixed position, right side of screen, vertically centered: `position: fixed; right: 0; top: 50%; transform: translateY(-50%);`
- Width: 260px
- Background: `rgba(15, 15, 20, 0.92)` with `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(255,255,255,0.08)` on left + top/bottom
- Border-radius: `16px 0 0 16px` (only left side rounded since it's flush to right edge)
- Box shadow: `−8px 0 40px rgba(0,0,0,0.5)`
- Font: same as `--font-family` or fallback to system-ui
- Scrollable if content overflows: `overflow-y: auto; max-height: 90vh;`

Toggle button: a small pill tab that sticks out to the left of the panel (`position: absolute; left: -36px; top: 50%; transform: translateY(-50%);`). Click it to collapse/expand the panel. Show ⚙ when collapsed, ✕ when open.

Panel collapses to just the toggle tab when hidden (so it never fully disappears).

### 3.C Control Types

**Color picker:**
```html
<div class="control-row">
  <label>Background</label>
  <div class="color-swatch-wrap">
    <input type="color" value="#0a0a12" data-token="--color-bg" />
    <span class="hex-label">#0a0a12</span>
  </div>
</div>
```
- When color changes: `document.documentElement.style.setProperty('--color-bg', value)`
- Update hex label live.

**Range slider:**
```html
<div class="control-row">
  <label>Card Radius <span class="val">16px</span></label>
  <input type="range" min="0" max="40" value="16" data-token="--radius-card" data-unit="px" />
</div>
```
- On input: set token, update the `<span class="val">` label.

**Select dropdown:**
```html
<div class="control-row">
  <label>Font Weight</label>
  <select data-token="--font-weight-heading">
    <option value="300">Light</option>
    <option value="400">Regular</option>
    <option value="500">Medium</option>
    <option value="600">Semibold</option>
    <option value="700" selected>Bold</option>
    <option value="800">Extrabold</option>
    <option value="900">Black</option>
  </select>
</div>
```

**Viewport toggle:**
```html
<div class="control-row viewport-toggle">
  <button class="active" data-width="390px">Mobile</button>
  <button data-width="100%">Desktop</button>
</div>
```
- Clicking a viewport button sets `document.getElementById('preview-frame').style.maxWidth = value`.

### 3.D Export Button

At the bottom of the panel:
```html
<button id="export-btn">↓ Export CSS Tokens</button>
```

On click, generate a `tokens.css` file with all current CSS variable values and trigger download:
```js
function exportTokens() {
  const style = getComputedStyle(document.documentElement)
  const tokens = [ /* list all --token-names */ ]
  const css = ':root {\n' + tokens.map(t =>
    `  ${t}: ${style.getPropertyValue(t).trim()};`
  ).join('\n') + '\n}'
  const blob = new Blob([css], { type: 'text/css' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'tokens.css'
  a.click()
}
```

### 3.E JS Architecture

All panel JS lives in one `<script>` block. Structure it as:

```js
// 1. Token map — every token with its control type, range, and unit
const TOKENS = [
  { token: '--color-bg',          type: 'color',  label: 'Background',     section: 'COLORS' },
  { token: '--color-accent',      type: 'color',  label: 'Accent',         section: 'COLORS' },
  { token: '--color-text',        type: 'color',  label: 'Text',           section: 'COLORS' },
  { token: '--font-size-base',    type: 'range',  label: 'Font Size',      section: 'TYPOGRAPHY', min: 10, max: 24, unit: 'px' },
  { token: '--font-size-heading', type: 'range',  label: 'Heading Size',   section: 'TYPOGRAPHY', min: 18, max: 72, unit: 'px' },
  { token: '--font-weight-heading',type:'select', label: 'Heading Weight', section: 'TYPOGRAPHY', options: [300,400,500,600,700,800,900] },
  { token: '--radius-card',       type: 'range',  label: 'Card Radius',    section: 'SHAPE',      min: 0,  max: 40, unit: 'px' },
  { token: '--radius-button',     type: 'range',  label: 'Button Radius',  section: 'SHAPE',      min: 0,  max: 40, unit: 'px' },
  { token: '--spacing-page',      type: 'range',  label: 'Page Padding',   section: 'SPACING',    min: 0,  max: 64, unit: 'px' },
  { token: '--spacing-gap',       type: 'range',  label: 'Gap',            section: 'SPACING',    min: 0,  max: 48, unit: 'px' },
  { token: '--transition-speed',  type: 'range',  label: 'Anim Speed',     section: 'MOTION',     min: 0,  max: 1,  unit: 's', step: 0.05 },
]

// 2. Build panel HTML from TOKENS array
// 3. Wire up event listeners (one generic handler per control type)
// 4. Panel toggle
// 5. Viewport toggle
// 6. Export function
```

Build the panel programmatically from `TOKENS` — do not hardcode individual controls. This makes it easy to extend.

---

## 4. OUTPUT STRUCTURE

The final HTML file must follow this skeleton exactly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Descriptive name based on reference]</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="[Google Fonts URL for inferred font]" rel="stylesheet" />
  <style>
    /* === DESIGN TOKENS === */
    :root { /* all --tokens here */ }

    /* === RESET === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* === BASE === */
    body { ... }

    /* === PREVIEW FRAME === */
    #preview-frame { ... }

    /* === COMPONENTS === */
    /* All rebuilt UI components */

    /* === EDIT PANEL === */
    #edit-panel { ... }
    /* All panel styles */
  </style>
</head>
<body>
  <!-- PREVIEW FRAME -->
  <div id="preview-frame">
    <!-- Rebuilt UI goes here -->
  </div>

  <!-- EDIT PANEL (built by JS) -->
  <div id="edit-panel">
    <button id="panel-toggle">⚙</button>
    <div id="panel-body">
      <div class="panel-header">Live Edit</div>
      <!-- JS populates controls here -->
    </div>
  </div>

  <script>
    // All panel JS here
  </script>
</body>
</html>
```

---

## 5. QUALITY GATES

Before finalizing output, check every item:

- [ ] Every color in the design maps to a `--color-*` token
- [ ] No hardcoded color values anywhere in component CSS (only `var(--color-*)`)
- [ ] No hardcoded px values for spacing/radius (only `var(--spacing-*)`, `var(--radius-*)`)
- [ ] Panel opens and closes with the toggle tab
- [ ] Every slider updates its token AND its label in real time
- [ ] Every color picker updates its token AND its hex label
- [ ] Export button downloads a valid `tokens.css`
- [ ] Viewport toggle switches between mobile and desktop correctly
- [ ] File opens standalone in Chrome/Safari/Firefox with zero errors
- [ ] Layout matches the reference at a glance — same structure, same proportions, same vibe

---

## 6. ANTI-PATTERNS — NEVER DO THESE

- Do NOT use React, Vue, or any framework. Vanilla HTML/CSS/JS only.
- Do NOT use `style=""` inline attributes for anything that should be a token.
- Do NOT hardcode pixel values that should be controllable (colors, radii, spacing).
- Do NOT make the control panel a plain `<details>` or `<alert>`. It must look and feel like a premium tool panel.
- Do NOT produce a generic "inspired by" version — reproduce the reference faithfully.
- Do NOT skip the export button.
- Do NOT use `!important` anywhere.
- Do NOT use `px` units inside `calc()` when combining with token values — always use consistent units.
- Do NOT make the preview fill the full browser width if the reference is a mobile screen — constrain it to a phone-sized frame.

---

## 7. EXTRA TOKENS TO ADD FOR SPECIFIC REFERENCE TYPES

### If reference is a dark-mode app screen:
Add:
```css
--color-bg-overlay:   rgba(0,0,0,0.6);
--color-glow:         rgba(99,102,241,0.15);
```

### If reference has a gradient background or accent:
Add:
```css
--gradient-bg:        linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%);
--gradient-accent:    linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-2) 100%);
```
And add a **Gradient Angle** range slider (0–360, unit: deg) in the panel.

### If reference has images or avatars:
Add placeholder handling — use `https://picsum.photos/seed/[unique-seed]/[w]/[h]` for any images. Add an **Image Style** toggle in the panel: `[Placeholder] [Grayscale] [Hidden]`.

### If reference has a chart or data visualization:
Recreate it with pure CSS (bar charts as `<div>` bars with percentage heights, rings as `conic-gradient`). Add a **Data Style** toggle in panel: `[Colored] [Monochrome]`.

---

## 8. EXAMPLE CONTROL PANEL SECTIONS BY REFERENCE TYPE

| Reference type         | Required panel sections                             |
|------------------------|-----------------------------------------------------|
| Mobile app screen      | Colors, Typography, Shape, Spacing, Motion, Viewport|
| Landing page / website | Colors, Typography, Shape, Spacing, Motion, Viewport|
| Dashboard / data UI    | Colors, Typography, Shape, Spacing, Data Style      |
| Card / component only  | Colors, Typography, Shape, Spacing                  |
| Login / auth screen    | Colors, Typography, Shape, Spacing, Motion          |
| Dark OLED app          | Colors (+ Glow token), Typography, Shape, Motion    |

Always include at minimum: Colors, Typography, Shape, Spacing.

---

## 9. DECLARING THE DESIGN READ

Before generating, output one line:

> **"Building this as: [type of screen] with [vibe] aesthetic — [dominant colors] palette, [font style], [radius description] corners."**

Example:
> *"Building this as: fintech dashboard, dark OLED aesthetic — near-black + indigo palette, geometric sans, pill-heavy corners."*

Then generate the file with no further explanation needed.
