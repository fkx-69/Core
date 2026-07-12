# Asset Generator — Quick Start Guide

## Overview

The **Asset Generator** skill helps you create and maintain a cohesive system of web graphics:
- Icons (navigation, features, status, social)
- Illustrations (heroes, empty states, scenes)
- Decorative patterns and elements
- UI components (badges, buttons, loaders)

It pairs with `gpt-image-bridge` for high-quality image generation and provides templates, organization, and consistency tools.

---

## Workflow

### Step 1: Set Up Your Asset Directory

From your project root:

```bash
./.claude/skills/asset-generator/generate-assets.sh init
```

This creates:
```
public/assets/
├── icons/          # Navigation, feature, status icons
├── illustrations/  # Hero, empty state, scene images
├── patterns/       # Dividers, textures, backgrounds
├── ui/             # Badges, buttons, components
├── decorative/     # Accent graphics, flourishes
├── .inventory.md   # Asset tracking & style guide
└── README.md       # Asset documentation
```

### Step 2: Get a Generation Template

For icons:
```bash
./.claude/skills/asset-generator/generate-assets.sh template icon
```

For illustrations:
```bash
./.claude/skills/asset-generator/generate-assets.sh template illustration
```

### Step 3: Customize Your Brief

Edit the template with your specific needs:

**Example: Icon Brief**
```
Generate a square "heart-filled" icon (64x64px, SVG-ready) in minimalist line-art.
Palette: #2D3436 (dark stroke), #FF4757 (red fill). 
Stroke weight: 1.5px.
Context: Favorite/like button in product cards.
```

**Example: Illustration Brief**
```
Generate a horizontal "team-collaboration" illustration (1200x600px) in editorial style.
Palette: #F5F1E8 (cream bg), #2D3436 (dark), #4A90E2 (blue accent).
Context: Team page hero section.
Mood: Professional, collaborative, warm.
Elements: 3-4 people working together, laptops, plants, minimal desk.
```

### Step 4: Generate Your Asset

Use the asset-generator skill:

**Ask Claude directly:**
```
"Generate this asset using asset-generator skill:
[Your customized brief from Step 3]"
```

Or invoke the skill explicitly:
```
/asset-generator [your brief]
```

The skill will use `gpt-image-bridge` to generate your image.

### Step 5: Save & Track

Save the generated image to the correct folder:

```bash
# Save icon
cp downloaded-icon.svg public/assets/icons/heart-filled.svg

# Save illustration  
cp downloaded-illustration.png public/assets/illustrations/team-collaboration.png
```

Then track it (manually edit `.inventory.md`):

```markdown
| heart-filled | icon | 64x64 | #2D3436, #FF4757 | ✓ Done | Like button in cards |
```

### Step 6: Use in Your Site

Reference in HTML/React:

```html
<!-- Icon -->
<img src="/assets/icons/heart-filled.svg" alt="Add to favorites" />

<!-- Illustration -->
<img src="/assets/illustrations/team-collaboration.png" alt="Our team" />
```

---

## Tips for Consistency

### 1. Lock Your Palette

Once you choose brand colors, **use exact hex codes** in all requests:

✅ Good:
```
Palette: #2D3436 (dark), #F5F1E8 (cream), #4A90E2 (blue)
```

❌ Vague:
```
Palette: dark, light, and blue
```

### 2. Build Asset Families

Generate related assets (icon set, illustration series) with consistent parameters:

```
Generate 4 feature icons (64x64px, SVG-ready) in minimalist line-art.
Palette: #2D3436 (dark), #4A90E2 (blue accent), max 1.5px stroke.
Context: Feature highlights on homepage.
Icons: 
  - analytics (chart icon)
  - security (shield icon)
  - speed (bolt icon)
  - support (headset icon)
```

### 3. Test at Actual Sizes

Don't assume an asset looks good on white. Test on:
- Your actual site background color
- Different zoom levels (mobile, tablet, desktop)
- Both light and dark modes if supported

### 4. Use Naming Conventions

Adopt a consistent naming scheme:

```
[category]-[name]-[variant].[ext]

Examples:
  icons/nav-home.svg
  icons/feature-security.svg
  illustrations/hero-main.png
  patterns/divider-01.svg
  ui/badge-beta.png
```

### 5. Document Your Process

Update `.inventory.md` as you go:

- Record hex codes and style settings
- Note which assets work well together
- Document any gotchas (e.g., "looks muddy at 32px, use 48px+")
- Link related assets

---

## Generation Templates Quick Reference

### Icon Set
```
Generate 4 square icons (64x64px, SVG-ready) in [STYLE].
Palette: [PRIMARY], [ACCENT], max 2 colors per icon.
Stroke: [WEIGHT]px.
Context: [Where they appear].
Icons: [List specific icons needed].
```

### Single Icon
```
Generate a square "[NAME]" icon (64x64px, SVG-ready) in [STYLE].
Palette: [HEX CODES].
Context: [Usage].
Notes: [Any specifics].
```

### Hero Illustration
```
Generate a horizontal "[NAME]" illustration ([WIDTH]x[HEIGHT]px) in [STYLE].
Palette: [BACKGROUND], [PRIMARY], [ACCENT].
Context: [Where used].
Mood: [Tone].
Elements: [What to include].
```

### Empty State
```
Generate an empty state illustration ([WIDTH]x[HEIGHT]px) for [FEATURE].
Style: [playful/minimal/editorial].
Palette: [HEX CODES].
Elements: [Character, icon, positive message implied].
```

### Background Pattern
```
Generate a repeating background pattern (800x800px tile).
Style: [minimalist/geometric/textured].
Palette: [BACKGROUND], [ACCENT].
Use: [full-width divider / background / texture].
```

---

## Troubleshooting

**Q: My generated assets have inconsistent colors across the set**
- A: Always include exact hex codes in every request, not descriptions like "same blue"

**Q: Icons look blurry/muddy at actual size**
- A: Test at the target size on your actual site background
- Increase the generation size (e.g., generate 128x128 then scale down)
- Use simpler forms (fewer details at small sizes)

**Q: Illustration looks generic/AI-generated**
- A: Be more specific in your brief:
  - Name the mood ("warm editorial", not just "modern")
  - Describe exact composition ("person at desk, top-left" vs "centered")
  - Add personality ("slightly playful" or "very professional")

**Q: Doesn't match the rest of my site**
- A: Check the palette — did you copy-paste exact hex codes?
- Check the style — icon set might be flat while illustration is editorial
- Compare composition variety — avoid the same layout repeating

---

## File Organization Checklist

Before committing assets to your repo:

- [ ] Asset saved in correct folder (`/icons`, `/illustrations`, etc)
- [ ] Filename follows your naming convention
- [ ] SVG or PNG (SVG for vectors/icons, PNG for illustrations)
- [ ] Image compressed (run via ImageOptim or similar)
- [ ] Color palette matches brand hex codes
- [ ] Asset tested on actual site background
- [ ] `.inventory.md` updated with asset info
- [ ] Alt text / aria-label prepared if needed

---

## Next: Full Page Composition

For complete section/page designs, pair this skill with:
- **`imagegen-frontend-web`** — Full page sections and layout
- **`asset-generator`** — Individual UI components and graphics

Together they create a cohesive visual system.

---

## Questions?

Refer to the full skill documentation in `SKILL.md` or ask Claude directly:

```
"Help me generate [asset type] for my website using the asset-generator skill"
```
