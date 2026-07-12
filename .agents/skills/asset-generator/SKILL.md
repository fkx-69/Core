---
name: asset-generator
description: Generate premium website assets (icons, illustrations, graphics, patterns, decorative elements) using image generation. Creates cohesive visual components optimized for web implementation with consistent style, palette, and execution. One asset per request.
---

# Asset Generator — Premium Web Graphics

This skill generates high-quality, reusable visual assets for websites: icons, illustrations, decorative graphics, patterns, and UI elements. Each asset is designed to integrate seamlessly into a cohesive visual system.

## What you can generate

- **Icons & Icon sets** — navigation icons, feature icons, status indicators, category icons
- **Illustrations** — scene illustrations, character poses, conceptual graphics, process diagrams
- **Decorative elements** — dividers, backgrounds, texture patterns, accent graphics
- **UI components** — badge designs, buttons, empty states, loading states, alerts
- **Hero graphics** — abstract forms, product visuals, conceptual imagery
- **Spot illustrations** — micro-animations implied, small scene graphics

## How it works

1. **Describe your asset** — be specific about style, size, use case, and context
2. **The skill calls `gpt-image-bridge`** — generates a high-quality PNG or SVG-ready asset
3. **Save and integrate** — use the asset directly in your site

## Request format

For best results, include:

**What:** Icon set, illustration, pattern, etc.
**Style:** Minimalist, editorial, playful, technical, etc.
**Size/Format:** Square (for icons), horizontal (for illustrations), specify pixel dimensions
**Palette:** Reference your site's color system or provide hex codes
**Context:** Where/how it will be used on the site
**Tone:** Matches your brand voice

## Example requests

### Icon generation
```
Generate a set of 4 square social icons (Instagram, LinkedIn, Twitter, GitHub) 
in a minimalist line-art style. 64x64px. 
Palette: #2D3436 (dark), #1E90FF (brand blue).
Style: clean geometric forms, 1.5px stroke width.
```

### Illustration
```
Create an editorial illustration of a person working at a desk with coffee and plants.
Horizontal 800x600px. Style: warm, inviting, slightly stylized.
Palette: cream background (#F5F1E8), warm neutrals, single brand accent (#E8704A).
Tone: professional but approachable, for a productivity app hero section.
```

### Decorative pattern
```
Generate a subtle repeating pattern for a page divider.
Square 200x200px tile. Style: geometric, minimal.
Palette: background #FAFAFA, accent #E0E0E0.
Use: full-width spacer between content sections on light background.
```

### UI component
```
Create an empty state illustration for a task management app.
Horizontal 500x400px. Style: playful but minimal, illustration quality.
Palette: soft pastels (#FFE8E0, #E8F4FF, #E8FFE0) on white background.
Includes: person/character, task list visual, check icon.
```

## Style consistency guide

For cohesive assets across your site:

### Minimalist Web Style
- Clean geometric forms
- Thin to medium strokes
- Limited color palette (2-3 colors max per asset)
- Generous whitespace
- Focus on clarity over decoration
- Line art or flat color blocks
- Pixel-perfect alignment

### Editorial Illustration Style
- Hand-drawn quality (not generic AI)
- Character-forward when appropriate
- Moderate color saturation
- Warm or cool neutral palettes
- Relatable human moments
- Scene-based rather than abstract
- Implies movement or narrative

### Technical/SaaS Style
- Clean sans-serif typography if included
- Dashboard or interface elements
- Isometric or flat perspective
- Professional color schemes
- Clear hierarchy
- Icon-forward
- Dashboard metaphors when appropriate

### Playful/Brand Style
- Rounded geometric forms
- Expressive characters
- Bold accent colors
- Slightly oversized proportions
- Emoji-adjacent feeling (not anime)
- Personality-forward
- Brand emoji consistency if you use them

## Tips for great assets

1. **Be specific about size.** Don't say "small icon" — say "64x64px navigation icon"
2. **Reference your site colors.** Include hex codes or reference existing brand assets
3. **State the context.** "Hero section background" vs "nav icon" changes the style completely
4. **Request sets as one asset.** Say "4 feature icons" as one request, not 4 separate ones
5. **Name your asset.** In your request, give it a working name ("hero-graphic-v1", "social-icons-blue")
6. **Save systematically.** Use a naming convention: `[type]-[name]-[variant].png`
7. **Lock the palette.** Once you've generated one asset, include the exact same hex codes in future requests so colors stay consistent
8. **Provide a reference.** If your site already has colors/style elsewhere, share that context

## File structure for assets

Organize saved assets:

```
/public/assets/
  /icons/
    nav-*.png
    feature-*.png
    status-*.png
  /illustrations/
    hero-*.png
    scene-*.png
    empty-state-*.png
  /patterns/
    divider-*.png
    texture-*.png
    background-*.png
  /ui/
    button-*.png
    badge-*.png
    empty-*.png
```

## Gotchas

- **First asset sets the tone.** Generate your first hero illustration or icon carefully — it anchors your visual language. Don't rush it.
- **Color consistency requires exact hex codes.** If you say "same blue", include the specific hex. "Same blue" across 5 generations drifts.
- **Illustrations look different at scale.** Test your asset at actual site sizes (especially for small icons, which can become muddy)
- **SVG vs PNG trade-off.** Icons: request SVG-ready (geometric, minimal) or PNG. Illustrations: PNG. Patterns: either, but SVG is better for scaling.
- **Asset brightness/saturation.** Background color matters hugely — test your asset on your actual site background, not white.
- **Batch requests save time.** "Generate 4 related feature icons as one asset" is faster and more consistent than 4 separate requests.

## Integration checklist

Before deploying an asset to your site:

- [ ] Asset matches site color palette (test exact hex codes)
- [ ] Asset looks sharp at actual size on the site
- [ ] Asset works on both light and dark backgrounds if needed
- [ ] Asset is optimized: SVG if vector, compressed PNG if raster
- [ ] Filename follows your naming convention
- [ ] Asset saved in correct `/public/assets/` subdirectory
- [ ] Alt text / aria labels prepared if needed for icons
- [ ] Consistent with other site assets (style, stroke weight, proportions)

## How to improve results

- Describe style in one sentence: "minimalist flat icons", not "modern and clean"
- Use industry references: "Stripe icon style", "Figma illustration approach"
- Lock dimensions: always 64x64, never "small"
- Include color range: "3 colors max", "monochrome only", "full RGB"
- Specify stroke weight: "2px strokes", "1.5px lines", "solid fills"
- State the mood: "professional", "playful", "editorial", "technical"

## Next steps after generating

1. Download the asset from the image generation result
2. Save it to `/public/assets/[type]/[name].png` (or .svg)
3. Use the asset in your HTML/components
4. Test at actual site zoom levels
5. Document the asset in your style guide or asset inventory

---

**Use this skill whenever you need to create or update cohesive, reusable graphics for your website.**
Pair it with `imagegen-frontend-web` for section compositions, and `asset-generator` for individual UI components and decorative elements.
