# Design

## Visual Theme
A balanced blend of rustic farm aesthetics and premium financial management. The interface uses deep, earthy tones contrasted with warm whites and brilliant gold highlights.

## Color Palette (OKLCH)
- **Base (Dark Brown)**: `oklch(20% 0.04 40)` - The foundation, used for deep backgrounds and primary text in light mode.
- **Surface (Light Brown)**: `oklch(85% 0.06 70)` - A warm, parchment-like surface for cards and sections.
- **Accent (Gold)**: `oklch(75% 0.15 85)` - Used for primary actions, success states, and highlighting wealth.
- **Contrast (White)**: `oklch(98% 0.01 60)` - A warm off-white for main backgrounds to keep the interface breathable.

## Typography
- **Headings**: Serif stack (e.g., 'Crimson Pro', 'Lora', serif). Conveys tradition and value.
- **Body**: Sans-serif stack (e.g., 'Inter', 'Plus Jakarta Sans', sans-serif). Conveys efficiency and clarity.
- **Scale**: Major Third (1.25) to ensure strong hierarchy between financial summaries and detail text.

## Layout & Spacing
- **Grid**: 8px baseline grid.
- **Radius**: 12px for main containers, 6px for buttons.
- **Elevation**: Minimal shadows, preferring thin earthy borders (`1px solid oklch(20% 0.04 40 / 0.1)`) to define space.

## Motion
- **Transitions**: 200ms `ease-out-quart` for hover states.
- **Entrance**: Subtle vertical drifts for new transaction entries.
