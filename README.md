# app-ui-skill

A collection of AI skills for building premium app UI from reference images — with live-edit control panels baked into the output.

## How to use

1. Open a conversation with Claude (or any capable AI model).
2. Paste the contents of a `SKILL.md` file into your system prompt or at the start of the conversation.
3. Upload or describe your reference image.
4. The AI generates a single self-contained `.html` file.
5. Open the file in your browser — tweak colors, spacing, fonts, and radius live without chatting.

## Skills

| Skill | File | What it does |
|---|---|---|
| **image-to-ui** | `skills/image-to-ui-skill/SKILL.md` | Takes a reference image → rebuilds the UI → injects a floating live-edit panel |
| **app-motion** | `skills/app-motion-skill/SKILL.md` | Adds high-quality Framer Motion or CSS animation patterns to any app UI |
| **3d-asset-generator** | `skills/3d-asset-skill/SKILL.md` | Takes a description or reference image → generates a 3D asset in Three.js with orbit controls and a live-edit panel |

## Output format

Every generated file is:
- **Single HTML file** — open directly in a browser, no build step
- **CSS custom properties** for every design token (colors, spacing, radii, fonts)
- **Floating ⚙ panel** — color pickers, sliders, dropdowns to edit tokens live
- **Export button** — downloads your tweaked tokens as `tokens.css`
