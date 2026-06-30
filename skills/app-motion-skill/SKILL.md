---
name: app-motion
description: Companion skill to image-to-ui. Instructs the AI to add premium, physics-aware animations and micro-interactions to any app UI output — entrance animations, gesture feedback, state transitions, and loading states. Vanilla CSS + JS only. No frameworks.
---

# app-motion: Premium App Animation Skill

> Pair with image-to-ui or use standalone.
> Output is always vanilla CSS animations + JS — no GSAP, no Framer Motion, no libraries.
> Every animation must feel like a native iOS/Android app, not a website.

---

## 1. ANIMATION PHILOSOPHY

App animations have three jobs:
1. **Orient** — tell the user where content came from and where it went.
2. **Respond** — confirm that the user's touch/click did something.
3. **Delight** — make transitions feel physical and satisfying.

They must never:
- Draw attention to themselves.
- Delay the user by more than 400ms for any interaction response.
- Use `linear` easing (always use custom cubic-bezier or spring approximation).

---

## 2. EASING PRESETS

Define these in `:root` and use them everywhere:

```css
:root {
  /* iOS-style spring approximation */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Material decelerate */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  /* Snappy enter */
  --ease-enter:    cubic-bezier(0.32, 0.72, 0, 1);
  /* Gentle exit */
  --ease-exit:     cubic-bezier(0.4, 0, 1, 1);
}
```

---

## 3. ENTRANCE ANIMATIONS

### Staggered list / card entrance
Every list or set of cards should stagger in from bottom with opacity:

```css
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card { animation: slideUpFade 0.5s var(--ease-out-expo) both; }
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 60ms; }
.card:nth-child(3) { animation-delay: 120ms; }
.card:nth-child(4) { animation-delay: 180ms; }
.card:nth-child(5) { animation-delay: 240ms; }
```

### Hero / header entrance
Scale up slightly from 96% while fading in:

```css
@keyframes heroEnter {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.hero { animation: heroEnter 0.6s var(--ease-out-expo) both; }
```

### Bottom sheet / modal entrance
Slide up from below:

```css
@keyframes sheetEnter {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.sheet { animation: sheetEnter 0.45s var(--ease-spring) both; }
```

---

## 4. INTERACTION FEEDBACK

Every interactive element needs tactile feedback. Apply these always:

### Button press
```css
button {
  transition: transform 0.1s var(--ease-exit), opacity 0.1s;
}
button:active {
  transform: scale(0.95);
  opacity: 0.85;
}
```

### Card hover (desktop) / tap highlight (mobile)
```css
.card {
  transition: transform var(--transition-speed) var(--ease-out-expo),
              box-shadow var(--transition-speed) var(--ease-out-expo);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}
```

### Icon tap pulse
```css
@keyframes iconPulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.icon-btn:active svg {
  animation: iconPulse 0.3s var(--ease-spring);
}
```

---

## 5. LOADING STATES

### Skeleton shimmer (for loading cards/lists)
```css
@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-card) 25%,
    var(--color-bg-elevated) 50%,
    var(--color-bg-card) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-card);
}
```

### Spinner (minimal, not Material)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
```

### Progress bar fill
```css
@keyframes fillBar {
  from { width: 0%; }
  to   { width: var(--target-width, 70%); }
}
.progress-fill {
  animation: fillBar 1s var(--ease-out-expo) 0.3s both;
}
```

---

## 6. STATE TRANSITIONS

### Tab switch (bottom nav active indicator)
```css
.tab-indicator {
  transition: transform 0.3s var(--ease-spring);
}
```
Move the indicator with `transform: translateX()` — never show/hide separate elements.

### Toggle switch
```css
.toggle-thumb {
  transition: transform 0.25s var(--ease-spring);
}
.toggle.active .toggle-thumb {
  transform: translateX(24px);
}
.toggle {
  transition: background-color 0.2s ease;
}
```

### Checkmark draw (on completion)
```css
@keyframes checkDraw {
  from { stroke-dashoffset: 24; }
  to   { stroke-dashoffset: 0; }
}
.checkmark path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: checkDraw 0.35s var(--ease-out-expo) forwards;
}
```

---

## 7. PANEL INTEGRATION

When paired with image-to-ui, add these controls to the MOTION section of the edit panel:

```js
{ token: '--transition-speed', type: 'range', label: 'Anim Speed',   min: 0,    max: 1,   unit: 's',  step: 0.05, section: 'MOTION' },
{ token: '--ease-spring',      type: 'select', label: 'Spring Feel', section: 'MOTION',
  options: [
    { label: 'Bouncy',  value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    { label: 'Smooth',  value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    { label: 'Snappy',  value: 'cubic-bezier(0.32, 0.72, 0, 1)' },
    { label: 'Linear',  value: 'linear' },
  ]
},
```

Also add a **"Replay Animations"** button in the MOTION section:
```js
document.querySelectorAll('[style*="animation"]').forEach(el => {
  el.style.animation = 'none'
  void el.offsetWidth // reflow
  el.style.animation = ''
})
```

---

## 8. RULES

- Every duration should use `var(--transition-speed)` as a base multiplier where possible.
- Never animate `width`, `height`, or `top/left` — always use `transform` and `opacity`.
- Entrance animations use `animation-fill-mode: both` so elements don't flash before animating.
- Keep total animation budget under 600ms for any user-triggered action.
- Stagger delay cap: 300ms max for the last item in a list (don't make users wait).
