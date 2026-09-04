---
name: Kinetic Horizon
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff5451'
  on-tertiary-container: '#5c0008'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for a high-energy professional wellness platform that bridges the gap between elite athletic performance and corporate productivity. It targets high-achieving professionals who require data-driven insights delivered with aesthetic sophistication. 

The visual style is **Corporate Tech with Glassmorphic Accents**. It leverages the depth of a premium dark environment while injecting "kinetic" energy through vibrant, glowing primary colors and sharp, high-contrast typography. The emotional response is one of momentum, precision, and vitality. The interface should feel like a high-end command center—authoritative yet invigorating.

Key aesthetic principles:
- **Kinetic Energy:** Use of gradients and glow effects to imply movement and progress.
- **Precision:** Tight alignment and structured data density to appeal to professional users.
- **Sophistication:** Subtle transparency and backdrop blurs to create a multi-layered, premium feel.

## Colors

The palette is anchored in a premium **Deep Midnight Blue** (#020617) to provide a high-contrast foundation for energetic accents.

- **Primary (Electric Indigo):** Used for primary actions, progress indicators, and active states. It represents the "spark" of achievement.
- **Secondary (Dynamic Teal):** Used for wellness metrics, health-positive data visualizations, and secondary CTA highlights.
- **Accent (Vitality Red):** Reserved for high-urgency notifications, caloric burn metrics, or critical performance alerts.
- **Background Tiers:**
    - Base: #020617 (Deep Midnight)
    - Surface: #0F172A (Slate Blue)
    - Overlay/Glass: #1E293B at 60% opacity with backdrop blur.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, clean, and slightly rounded geometric structure, which maintains readability while feeling fresh and energetic.

- **Headlines:** Use Bold (700) or ExtraBold (800) weights with slightly tighter letter spacing to create a sense of impact and urgency.
- **Body:** Regular (400) weight is used for maximum legibility against dark backgrounds. Ensure a slightly higher line-height (1.5-1.6) to prevent text fatigue in data-heavy contexts.
- **Labels:** Use Semibold (600) with uppercase styling and increased letter spacing for category headers and small UI descriptors to differentiate from body content.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **The Rhythm:** Based on an 8px baseline grid to ensure mathematical harmony between components.
- **Dashboard Philosophy:** Use "Card-based" modularity. Components should be grouped into widgets that can scale from 3 to 12 columns depending on data complexity.
- **Safe Zones:** High-energy visuals require generous margins (48px on desktop) to allow the "Deep Midnight" background to act as negative space, preventing the UI from feeling cluttered despite high data density.

## Elevation & Depth

Depth is conveyed through **Glassmorphism and Tonal Layering** rather than traditional drop shadows.

1.  **Z-0 (Base):** Deep Midnight Blue (#020617).
2.  **Z-1 (Surface):** Slate Blue (#0F172A) with a subtle 1px border (#1E293B) to define edges without heavy contrast.
3.  **Z-2 (Interactive/Floating):** Semi-transparent layers (RGBA 30, 41, 59, 0.6) with a 12px backdrop blur.
4.  **Accents:** Use "Glow Shadows"—low-opacity drop shadows that match the color of the element (e.g., a 10% Indigo blur behind a primary button) to simulate light emission.

## Shapes

The shape language is **Sleek & Professional**. 

- **Standard Radius:** 8px for small components (inputs, tags, chips).
- **Container Radius:** 12px for larger dashboard widgets and cards (rounded-lg).
- **Interactive Radius:** 24px for action-oriented buttons to give them a distinct, approachable feel (rounded-xl).
- **Visual Style:** Borders should be thin (1px) and use semi-transparent colors to maintain a high-end tech aesthetic.

## Components

### Buttons
- **Primary:** Gradient background (Electric Indigo to Dynamic Teal), white text, 24px corner radius. On hover, increase the intensity of the glow shadow.
- **Secondary:** Ghost style with a 1px Dynamic Teal border and Teal text. 

### Dashboard Widgets (Cards)
- **Background:** Slate Blue at 80% opacity with backdrop blur.
- **Header:** Label-sm typography for titles, paired with a subtle separator line.
- **Data Visualization:** Use high-contrast lines for charts. Electric Indigo for primary data, Dynamic Teal for benchmarks. Avoid solid fills; use gradients that fade into the background.

### Inputs & Fields
- **Style:** Darker than the surface color with a subtle 1px border. 
- **Active State:** The border glows with the Electric Indigo primary color.

### Chips & Badges
- **Status:** Use Vitality Red for "Below Goal" and Dynamic Teal for "On Track." 
- **Appearance:** Low-opacity background fill with a high-opacity text color for a modern, integrated look.

### Progress Bars
- **Container:** Dark track with 10% opacity.
- **Fill:** Linear gradient from Primary to Secondary to represent the "Spectrum of Achievement."