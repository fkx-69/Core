# Website Assets

Generated visual assets for the website including:
- **icons/** — Navigation, feature, status icons
- **illustrations/** — Scene illustrations, empty states, hero graphics
- **patterns/** — Dividers, textures, background patterns
- **ui/** — Component graphics (badges, buttons, etc)
- **decorative/** — Accent graphics, decorative elements

## How to use

1. Place your asset file in the appropriate subdirectory
2. Update `.inventory.md` to document the asset
3. Reference in HTML/components

Example:
```html
<img src="/assets/icons/nav-home.svg" alt="Home" />
<img src="/assets/illustrations/hero-main.png" alt="Hero section" />
```

## Best practices

- Use SVG for icons and vector graphics
- Use PNG for illustrations and raster graphics
- Compress images before committing
- Maintain consistent naming conventions
- Keep color palette locked for consistency
- Test assets at actual site sizes

## See also

- `.inventory.md` — Asset inventory and style guide
- `/public/assets/.inventory.md` — Detailed asset documentation
