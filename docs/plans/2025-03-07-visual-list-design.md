# Visual List View Design - "Liste visuelle"

**Date:** 2025-03-07
**Feature:** Full-screen swipeable wine image carousel showing inventory wines

## Overview

Add a new "Liste visuelle" view accessible from the hamburger menu that displays wine images in full-screen with swipe navigation. Users can browse through inventory wines, see key information overlaid at the bottom, and tap images to view details.

## Architecture & File Structure

### New Files
- `/public/views/visual.html` - Visual list page
- `/public/css/visual.css` - Carousel and overlay styles
- `/public/js/visual.js` - Carousel logic, sorting, and navigation

### Dependencies
- **Swiper.js** - Mobile-first carousel library (~40KB gzipped)
- Load via CDN or npm package

### Integration Points
- **Server route:** Add `/visual` route in server.js
- **Menu integration:** Add "Liste visuelle" to menu.js for all pages (index, cellar, details, activities)
- **Existing APIs:** Use `fetchWines()` from wineAPI.js

## Data Flow & Component Logic

### Data Loading
1. On page load, call existing `fetchWines()` API
2. Filter wines where `qty > 0` (only inventory wines)
3. Apply default sort: Type (Rouge first)

### Sorting Options
**Dropdown with 4 options:**
- **Type** (default) - Group by wine type, alphabetically within groups
  - Order: Rouge → Blanc → Mousseux → Other
  - Within each group: Sort alphabetically by name
- **Nom** - Alphabetical by wine name
- **Notation** - Rating descending (highest first)
- **Quantité** - Quantity descending (most stock first)

### Carousel Behavior
- Initialize Swiper.js with filtered/sorted wine array
- Each wine = one slide
- Swipe left/right for smooth sliding navigation
- Tap image → navigate to `/details?id={wineId}`

### Wine Display Logic
**If wine has image:**
- Show full-screen wine label image
- Use `object-fit: contain` to prevent cropping
- Background: `var(--color-bg-dark)`

**If wine has no image (placeholder):**
- Show wine name centered on colored background
- Background gradient based on wine type:
  - Rouge: `linear-gradient(135deg, #C41E3A, #8B0000)`
  - Blanc: `linear-gradient(135deg, #F5E6D3, #E6C17A)`
  - Mousseux: `linear-gradient(135deg, #F4D03F, #C9A961)`
  - Other: `var(--color-bg-elevated)`

## UI/UX Details

### Header Area
- Fixed hamburger menu at top (existing component)
- "Vino Veritas" title centered (Cinzel Decorative font)
- z-index ensures header stays above carousel

### Sort Dropdown
- **Position:** Fixed below hamburger, `top: calc(var(--safe-top) + 80px)`
- **Width:** Full viewport width
- **Style:** Consistent with design system
  - Background: `var(--color-bg-surface)`
  - Border bottom: `1px solid rgba(201, 169, 97, 0.15)`
  - Dropdown centered
- **Options:** "Type", "Nom", "Notation", "Quantité"

### Carousel Slides
- **Height:** Fill viewport minus header + sorter
- **Image positioning:** Centered, `object-fit: contain`
- **Background:** `var(--color-bg-dark)`

### Bottom Overlay
- **Position:** Absolute at bottom of each slide
- **Height:** ~150px
- **Gradient:** `linear-gradient(to bottom, transparent, rgba(26, 20, 20, 0.9))`
- **Padding:** 16px + safe-area-inset-bottom

### Overlay Content
**Layout:**
- Wine name: 1.25rem, bold, `var(--color-secondary)`
- Second line layout:
  - Vintage (if present): 1.1rem, prominent
  - Qty badge: Color-coded by type (same as list view)
  - Rating: Displayed like list view (or "—" if missing/0)
- Text color: `var(--color-text-primary)`

### Placeholder Styling (No Image)
- Wine name: 2rem font, centered vertically and horizontally
- Background: Type-based gradient (see above)
- Text color: White or appropriate contrast color

### Swiper Configuration
```javascript
{
  direction: 'horizontal',
  loop: false,
  speed: 400,
  touchRatio: 1,
  resistance: true,
  resistanceRatio: 0.85,
  keyboard: false, // Mobile touch only
  slidesPerView: 1,
  spaceBetween: 0
}
```

## Error Handling & Edge Cases

### No Wines in Inventory
- Display centered message: "Aucun vin en inventaire"
- Show link/button to return home

### API Fetch Failures
- Show error message: "Erreur de chargement des vins"
- Log error to console for debugging

### Image Loading Failures
- If image URL exists but fails to load: Use `onerror` handler to switch to placeholder
- Fallback to placeholder style automatically

### Missing Data Fields
- **Vintage missing:** Don't show vintage in overlay
- **Rating 0/null:** Display "—" instead
- **Quantity 0:** Should not appear (filtered out)

### Sort State Persistence
- Store selected sort in URL query parameter: `/visual?sort=notation`
- On page load: Read sort parameter and apply
- Default if no parameter: "Type"
- Allows bookmarking/sharing specific views

### Navigation Edge Cases
- **First slide + swipe right:** Bounce effect (Swiper default)
- **Last slide + swipe left:** Bounce effect
- **Sort change:** Reset carousel to first slide in new order

## Mobile Considerations

### Touch Gestures
- Primary: Horizontal swipe (left/right)
- Tap: Navigate to details
- No keyboard navigation (mobile-first)

### Safe Areas
- Respect safe-area-insets for iPhone notches
- Apply to header top and overlay bottom padding

### Performance
- Lazy load images as user swipes (Swiper lazy loading)
- Optimize image sizes for mobile (consider responsive images if needed)

## Success Criteria

1. User can access "Liste visuelle" from hamburger menu
2. Only wines with qty > 0 are shown
3. Default sort is "Type" with Rouge wines first
4. Smooth swipe navigation works on iOS and Android
5. Tapping image navigates to wine details
6. Wines without images show appropriate placeholder
7. All wine info (name, vintage, qty, rating) displays correctly
8. Sort dropdown changes order immediately
9. Header remains accessible and functional
10. No performance issues with 50+ wines in inventory
