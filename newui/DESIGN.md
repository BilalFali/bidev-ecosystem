---
name: Bidev
colors:
  surface: '#101418'
  surface-dim: '#101418'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#272a2f'
  surface-container-highest: '#31353a'
  on-surface: '#e0e2e9'
  on-surface-variant: '#c0c7d3'
  inverse-surface: '#e0e2e9'
  inverse-on-surface: '#2d3136'
  outline: '#8a919c'
  outline-variant: '#404751'
  surface-tint: '#9ecaff'
  primary: '#9ecaff'
  on-primary: '#003258'
  primary-container: '#0175c2'
  on-primary-container: '#f5f7ff'
  inverse-primary: '#0061a3'
  secondary: '#a4c9ff'
  on-secondary: '#00315d'
  secondary-container: '#02569b'
  on-secondary-container: '#a9ccff'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#b05a00'
  on-tertiary-container: '#fff5f0'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#9ecaff'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#00497c'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#101418'
  on-background: '#e0e2e9'
  surface-variant: '#31353a'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-base:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  code-label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The brand is defined by technical precision and high-performance aesthetics, catering to a developer ecosystem that demands speed and clarity. The design system adopts a **Premium SaaS / Modern Corporate** style, drawing heavy inspiration from the "Linear" and "Vercel" aesthetic—meaning high-contrast typography, dark-mode-first interfaces, and meticulous attention to micro-details.

The emotional response should be one of competence and "flow." It avoids unnecessary decoration in favor of utility, using subtle glassmorphism and motion to indicate depth and system state. This is a tool for builders, prioritizing content density without sacrificing elegance.

## Colors
The palette is centered on a "Deep Night" foundation, utilizing a range of Zinc and Slate grays to create a tiered hierarchy of surfaces. 

- **Primary & Secondary:** Flutter-inspired blues serve as the core functional colors. Use the lighter `#0175C2` for primary actions and interactive states, and the deeper `#02569B` for subtle accents or gradient stops.
- **Accents:** Gradients should be used sparingly, primarily on high-level "Hero" moments or primary call-to-action buttons, transitioning from Primary Blue to a slightly more cyan or indigo tint.
- **System States:** Success, Warning, and Error states should use desaturated versions of green, amber, and red to maintain the premium, low-vibrancy feel of the dark theme.

## Typography
The typography system uses **Geist** for its neutral, technical character and exceptional legibility at small sizes. The hierarchy is tight, with significant contrast between display headings and body text.

- **Technical Flair:** For code snippets, metadata, and small labels (like version numbers or API endpoints), use **JetBrains Mono**. This reinforces the developer-first nature of the platform.
- **Readability:** Body text should maintain a healthy line height (1.6x) to ensure long-form documentation remains scannable. Headlines use tighter tracking (letter-spacing) to create a "locked-in" professional look.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1200px max-width grid on desktop to ensure optimal line lengths for technical reading, while the UI chrome (sidebars, nav) remains fluid.

- **Grid:** Use a 12-column grid for dashboard views.
- **Rhythm:** All spacing is derived from a 4px base unit. Component padding should generally follow a 12px / 16px / 24px progression.
- **Density:** Provide two density modes: "Default" for marketing and onboarding pages, and "Compact" for data-heavy developer consoles.

## Elevation & Depth
Depth is achieved through **Tonal Layering** rather than traditional heavy shadows. 

- **Surface Tiers:** The background is the darkest layer (`#09090b`). Cards and modals sit one tier higher (`#18181b`). 
- **Borders:** Use subtle, 1px solid borders (`#27272a`) to define shapes. This is the primary method of separation.
- **Glassmorphism:** Use for floating elements like navigation bars or dropdown menus. Apply a `backdrop-filter: blur(12px)` with a semi-transparent surface color (`rgba(24, 24, 27, 0.8)`).
- **Glow:** On hover states for primary cards, a very faint, large-radius blue outer glow can be used to simulate a "backlit" effect.

## Shapes
The shape language is **precise and geometric**. 

- **Corner Radius:** Use the "Soft" setting (0.25rem / 4px) for small components like checkboxes and tags. Standard cards and buttons should use `rounded-lg` (8px). 
- **Exceptions:** Search bars and primary action buttons can occasionally use a higher roundedness for visual distinction, but never full "pill" shapes, to maintain the professional, technical tone.

## Components
- **Buttons:** Primary buttons use the Blue gradient with white text. Secondary buttons are "Ghost" style (border only) or subtle gray fills.
- **Inputs:** Dark backgrounds with a subtle inner shadow. On focus, the border transitions to Primary Blue with a 1px solid weight.
- **Cards:** Cards should have no shadow by default, relying on the `#27272a` border. On hover, the border color should brighten slightly.
- **Chips/Tags:** Use monospaced font (JetBrains Mono) for tags. Backgrounds should be low-opacity versions of the tag's semantic color (e.g., a faint blue tint for "Feature" tags).
- **Code Blocks:** Syntax highlighting should follow a "Sublime" or "One Dark" inspired theme that complements the Zinc/Blue palette of the design system.
- **Navigation:** Vertical sidebars for app contexts; horizontal top-nav for marketing contexts. Sidebars should use "Active" states defined by a vertical 2px blue line on the left edge of the menu item.