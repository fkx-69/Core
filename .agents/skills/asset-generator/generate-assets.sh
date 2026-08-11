#!/bin/bash
# Asset Generator Helper Script
# Helps organize and document generated assets for web projects

set -e

ASSETS_DIR="${1:-.}/public/assets"
INVENTORY_FILE="${ASSETS_DIR}/.inventory.md"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize asset structure
init_assets() {
  echo -e "${BLUE}Initializing asset structure at: ${ASSETS_DIR}${NC}"

  mkdir -p "${ASSETS_DIR}/icons"
  mkdir -p "${ASSETS_DIR}/illustrations"
  mkdir -p "${ASSETS_DIR}/patterns"
  mkdir -p "${ASSETS_DIR}/ui"
  mkdir -p "${ASSETS_DIR}/decorative"

  if [ ! -f "${INVENTORY_FILE}" ]; then
    cat > "${INVENTORY_FILE}" << 'EOF'
# Asset Inventory

## Color Palette
Document your site's color system here for consistency.

```
Primary: #000000
Secondary: #FFFFFF
Accent: #0066FF
```

## Icons

| Name | Type | Size | Palette | Status | Notes |
|------|------|------|---------|--------|-------|
| Example | nav | 64x64 | Primary | ✓ Done | Navigation menu icon |

## Illustrations

| Name | Type | Size | Palette | Status | Notes |
|------|------|------|---------|--------|-------|
| hero-main | hero | 1200x600 | Full | ✓ Done | Home page hero section |

## Patterns

| Name | Use | Size | Palette | Status | Notes |
|------|-----|------|---------|--------|-------|
| divider-01 | section divider | 2000x100 | Primary | ✓ Done | Decorative spacer |

## UI Components

| Name | Type | Size | Palette | Status | Notes |
|------|------|------|---------|--------|-------|
| empty-state | empty state | 500x400 | Full | ✓ Done | When no data available |

## Decorative Elements

| Name | Use | Size | Palette | Status | Notes |
|------|-----|------|---------|--------|-------|
| background-texture | bg | 800x800 | Neutral | ✓ Done | Subtle page background |

---

## Asset Style Guide

### Minimalist
- Clean geometric forms
- 1.5-2px strokes
- Limited palette (2-3 colors max)
- Line art or flat fills

### Editorial
- Hand-drawn quality
- Warm/cool neutrals
- Scene-based
- Character forward when appropriate

### Technical
- Clean sans-serif if text
- Dashboard elements
- Isometric or flat perspective
- Professional scheme

### Playful
- Rounded forms
- Expressive characters
- Bold accents
- Brand personality

---

EOF
    echo -e "${GREEN}✓ Inventory created at: ${INVENTORY_FILE}${NC}"
  fi
}

# List current assets
list_assets() {
  echo -e "${BLUE}Asset Inventory:${NC}"
  echo ""

  for category in icons illustrations patterns ui decorative; do
    if [ -d "${ASSETS_DIR}/${category}" ]; then
      count=$(find "${ASSETS_DIR}/${category}" -type f \( -name "*.png" -o -name "*.svg" \) | wc -l)
      if [ $count -gt 0 ]; then
        echo -e "${YELLOW}${category}/ ($count files)${NC}"
        ls -1 "${ASSETS_DIR}/${category}" | grep -E '\.(png|svg)$' | sed 's/^/  • /'
        echo ""
      fi
    fi
  done
}

# Create a prompt template for icon generation
icon_template() {
  cat << 'EOF'
# Icon Generation Template

Generate a square icon (64x64px, SVG-ready) in [STYLE].

**Icon name:** [NAME]
**Style:** [minimalist line-art / flat / editorial / etc]
**Palette:** [HEX CODES, max 2-3 colors]
**Stroke weight:** [1.5px / 2px / etc]
**Context:** [Where it's used: nav menu, feature highlight, etc]
**Notes:** [Any specific requirements]

Example:
---
Generate a square "dashboard" icon (64x64px, SVG-ready) in minimalist line-art.
Palette: #2D3436 strokes, #1E90FF accent. 1.5px stroke weight.
Context: Navigation menu icon for analytics section.
---
EOF
}

# Create a prompt template for illustration
illustration_template() {
  cat << 'EOF'
# Illustration Generation Template

Generate a horizontal illustration ([WIDTH]x[HEIGHT]px) in [STYLE].

**Asset name:** [NAME]
**Style:** [editorial / playful / minimal / etc]
**Palette:** [HEX CODES + brief description]
**Context:** [Where used: hero section, empty state, etc]
**Mood:** [professional, approachable, bold, warm, etc]
**Elements:** [What should be in the illustration]
**Notes:** [Any specific constraints]

Example:
---
Generate a horizontal "hero-main" illustration (1200x600px) in editorial style.
Palette: #F5F1E8 background, #2D3436 typography, #E8704A accent.
Context: Home page hero section background.
Mood: Warm, inviting, professional.
Elements: Person at desk with coffee, plants, minimal desk setup.
---
EOF
}

# Show template
show_template() {
  if [ -z "$1" ]; then
    echo "Usage: $0 template [icon|illustration]"
    exit 1
  fi

  case "$1" in
    icon)
      icon_template
      ;;
    illustration)
      illustration_template
      ;;
    *)
      echo "Unknown template type: $1"
      exit 1
      ;;
  esac
}

# Add asset to inventory
add_to_inventory() {
  local name="$1"
  local type="$2"
  local size="$3"
  local category="$4"

  if [ -z "$name" ] || [ -z "$type" ] || [ -z "$size" ] || [ -z "$category" ]; then
    echo "Usage: $0 add <name> <type> <size> <category>"
    echo "Examples:"
    echo "  $0 add nav-home icon '64x64' icons"
    echo "  $0 add hero-main hero '1200x600' illustrations"
    exit 1
  fi

  echo -e "${GREEN}Asset added: ${name} (${type}) ${size}${NC}"
  echo "To update inventory, edit: ${INVENTORY_FILE}"
}

# Create README for assets directory
create_readme() {
  cat > "${ASSETS_DIR}/README.md" << 'EOF'
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
EOF

  echo -e "${GREEN}✓ README created${NC}"
}

# Main command routing
case "${1:-help}" in
  init)
    init_assets
    create_readme
    ;;
  list|ls)
    init_assets > /dev/null 2>&1 || true
    list_assets
    ;;
  template)
    show_template "$2"
    ;;
  add)
    shift
    add_to_inventory "$@"
    ;;
  *)
    cat << 'EOF'
Asset Generator Helper — Organize and document web assets

Usage:
  ./generate-assets.sh init          # Initialize asset directories
  ./generate-assets.sh list          # List all current assets
  ./generate-assets.sh template      # Show generation templates
  ./generate-assets.sh template icon          # Icon template
  ./generate-assets.sh template illustration  # Illustration template
  ./generate-assets.sh add <name> <type> <size> <category>

Examples:
  ./generate-assets.sh init
  ./generate-assets.sh list
  ./generate-assets.sh template icon
  ./generate-assets.sh add nav-home icon "64x64" icons

The script initializes:
  public/assets/
    ├── icons/
    ├── illustrations/
    ├── patterns/
    ├── ui/
    ├── decorative/
    ├── .inventory.md
    └── README.md

Use with asset-generator skill:
  1. Run: ./generate-assets.sh template [icon|illustration]
  2. Copy the template and customize for your asset
  3. Use asset-generator skill to generate your image
  4. Save result to public/assets/[category]/
  5. Run: ./generate-assets.sh add <name> <type> <size> <category>

EOF
    exit 1
    ;;
esac
