/**
 * visual.js - Carousel Wine List Logic
 * Handles loading wines, filtering inventory, sorting, and Swiper carousel initialization
 */

// Global variables
let swiper = null;
let inventoryWines = [];
let currentSort = 'type';

/**
 * jQuery ready - Initialize page with wine data and event handlers
 */
$(document).ready(function () {
  // Parse sort parameter from URL if present
  const urlSort = getUrlParameter('sort');
  if (urlSort && ['type', 'name', 'rating', 'quantity'].includes(urlSort)) {
    currentSort = urlSort;
    $('#sortSelector').val(urlSort);
  }

  // Load and display wines on page load
  loadAndDisplayWines();

  // Handle sort dropdown changes
  $('#sortSelector').on('change', function () {
    currentSort = $(this).val();
    updateURLParameter('sort', currentSort);
    loadAndDisplayWines();
  });
});

/**
 * loadAndDisplayWines - Async function to fetch, filter, sort and build carousel
 * Fetches all wines from API, filters to only inventory (qty > 0),
 * sorts according to currentSort, and builds the Swiper carousel
 */
async function loadAndDisplayWines() {
  try {
    // Fetch wines using existing wineAPI.js function
    await loadWines();

    // Filter wines to only show inventory items (qty > 0)
    inventoryWines = wines.filter(wine => wine.qty > 0);

    // Handle empty state
    if (inventoryWines.length === 0) {
      $('#swiperWrapper').empty();
      $('#wineSwiper').hide();
      $('#sortSelector').prop('disabled', true);
      $('#emptyState').show();
      $('#errorState').hide();
      if (swiper) swiper.destroy();
      return;
    }

    // Show carousel, hide empty/error states
    $('#wineSwiper').show();
    $('#emptyState').hide();
    $('#errorState').hide();
    $('#sortSelector').prop('disabled', false);

    // Sort wines according to currentSort
    sortWines();

    // Build carousel
    buildCarousel();
  } catch (error) {
    console.error('Error loading wines:', error);
    $('#swiperWrapper').empty();
    $('#wineSwiper').hide();
    $('#emptyState').hide();
    $('#errorState').show();
    $('#sortSelector').prop('disabled', true);
    if (swiper) swiper.destroy();
  }
}

/**
 * sortWines - Handles 4 sort modes
 * - type: Sort by wine type (Red → White → Sparkling → Other)
 * - name: Sort alphabetically by name
 * - rating: Sort by rating highest first
 * - quantity: Sort by quantity most first
 */
function sortWines() {
  const typeOrder = { 'red wine': 0, 'white wine': 1, 'mousseux': 2, 'rosé wine': 3 };

  switch (currentSort) {
    case 'type':
      // Sort by type (Rouge→Blanc→Mousseux→Other), then by name
      inventoryWines.sort((a, b) => {
        const typeA = normalizeWineType(a.type);
        const typeB = normalizeWineType(b.type);
        const orderA = typeOrder[typeA] !== undefined ? typeOrder[typeA] : 4;
        const orderB = typeOrder[typeB] !== undefined ? typeOrder[typeB] : 4;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
      break;

    case 'name':
      // Sort alphabetically by name
      inventoryWines.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'rating':
      // Sort by rating highest first (ensure notation exists)
      inventoryWines.sort((a, b) => {
        const ratingA = a.notation || 0;
        const ratingB = b.notation || 0;
        return ratingB - ratingA;
      });
      break;

    case 'quantity':
      // Sort by quantity most first
      inventoryWines.sort((a, b) => b.qty - a.qty);
      break;

    default:
      // Default to type sort
      sortWines();
  }
}

/**
 * buildCarousel - Creates Swiper slides from inventoryWines and initializes Swiper.js
 * Destroys existing Swiper if present, then creates new one with mobile config
 */
function buildCarousel() {
  // Clear existing slides
  const wrapper = $('#swiperWrapper');
  wrapper.empty();

  // Build slides for each wine
  inventoryWines.forEach((wine, index) => {
    const slide = buildSlide(wine);
    wrapper.append(slide);
  });

  // Destroy existing Swiper instance if present
  if (swiper) {
    swiper.destroy();
    swiper = null;
  }

  // Initialize Swiper with mobile-optimized config
  swiper = new Swiper('.swiper', {
    effect: 'slide',
    loop: inventoryWines.length > 1, // Only loop if more than 1 wine
    grabCursor: true,
    touchEventsTarget: 'wrapper',
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    threshold: 5,
    speed: 300,
    resistance: true,
    resistanceRatio: 0.85,
    preventInteractionOnTransition: false,
    // Navigation dots
    pagination: false,
    // Navigation arrows
    navigation: false,
  });
}

/**
 * buildSlide - Generates HTML for individual wine slide
 * Creates a slide with wine image/placeholder and overlay with wine info
 *
 * @param {Object} wine - Wine object with properties: _id, name, vintage, qty, type, notation, img
 * @returns {jQuery} - jQuery element representing the slide
 */
function buildSlide(wine) {
  const slide = $('<div class="swiper-slide"></div>');

  // Wine image container
  const imageContainer = $('<div class="wine-image"></div>');

  // Add image or placeholder based on wine.image
  if (wine.image) {
    const img = $('<img>').attr('src', wine.image).attr('alt', wine.name);
    img.on('error', function () {
      handleImageError($(this), wine.type);
    });
    imageContainer.append(img);
  } else {
    // Show placeholder with wine type icon
    const wineTypeClass = getWineTypeClass(wine.type);
    const placeholder = $('<div class="wine-placeholder"></div>')
      .addClass(`type-${getPlaceholderTypeClass(wine.type)}`);

    // Add emoji icon based on wine type
    const typeEmoji = getWineTypeEmoji(wine.type);
    placeholder.text(typeEmoji);

    imageContainer.append(placeholder);
  }

  slide.append(imageContainer);

  // Bottom overlay with wine information
  const overlay = $('<div class="wine-overlay"></div>');

  // Wine name
  const name = $('<div class="wine-name"></div>').text(wine.name);
  overlay.append(name);

  // Wine metadata container (vintage, type badge)
  const metaContainer = $('<div class="wine-meta-container"></div>');

  // Vintage (if available)
  if (wine.vintage) {
    const vintage = $('<div class="wine-vintage"></div>').text(wine.vintage);
    metaContainer.append(vintage);
  }

  // Wine type badge
  const wineTypeClass = getWineTypeClass(wine.type);
  const typeBadge = $('<div class="wine-type-badge"></div>')
    .addClass(wineTypeClass)
    .text(getWineTypeLabel(wine.type));
  metaContainer.append(typeBadge);

  overlay.append(metaContainer);

  // Bottom info: quantity badge and rating
  const bottomInfo = $('<div class="wine-bottom-info"></div>');

  // Quantity badge
  const qtyBadge = $('<div class="wine-qty-badge"></div>')
    .addClass(wineTypeClass)
    .text(`${wine.qty} en stock`);
  bottomInfo.append(qtyBadge);

  // Rating section
  const ratingSection = $('<div class="wine-rating"></div>');
  if (wine.notation && wine.notation > 0) {
    const rating = Number(wine.notation);
    const ratingValue = $('<div class="wine-rating-value"></div>')
      .text(rating.toFixed(1));
    const stars = $('<div class="wine-rating-stars"></div>')
      .text('★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : ''));
    ratingSection.append(ratingValue);
    ratingSection.append(stars);
  } else {
    const noRating = $('<div class="wine-rating-value"></div>')
      .text('—');
    ratingSection.append(noRating);
  }
  bottomInfo.append(ratingSection);

  overlay.append(bottomInfo);

  // Add click handler to navigate to details page
  slide.on('click', function (e) {
    // Prevent triggering on swipe
    if (e.target.tagName !== 'IMG' && e.target.closest('.wine-image') === null) return;
    navigateToDetails(wine._id);
  });

  slide.append(overlay);

  return slide;
}

/**
 * getWineTypeClass - Maps wine types to CSS classes for styling
 * Maps wine type strings to the corresponding CSS class names
 *
 * @param {string} type - Wine type from database
 * @returns {string} - CSS class name (wine-type-red, wine-type-white, wine-type-sparkling, wine-type-other)
 */
function getWineTypeClass(type) {
  const normalizedType = normalizeWineType(type);

  if (normalizedType === 'red wine') return 'wine-type-red';
  if (normalizedType === 'white wine') return 'wine-type-white';
  if (normalizedType === 'mousseux') return 'wine-type-sparkling';
  if (normalizedType === 'rosé wine') return 'wine-type-rose';

  return 'wine-type-other';
}

/**
 * getPlaceholderTypeClass - Gets placeholder class for wine type icons
 * Used for placeholder styling in carousel slides
 *
 * @param {string} type - Wine type from database
 * @returns {string} - Placeholder class (red, white, sparkling, other)
 */
function getPlaceholderTypeClass(type) {
  const normalizedType = normalizeWineType(type);

  if (normalizedType === 'red wine') return 'red';
  if (normalizedType === 'white wine') return 'white';
  if (normalizedType === 'mousseux') return 'sparkling';
  if (normalizedType === 'rosé wine') return 'rose';

  return 'other';
}

/**
 * getWineTypeLabel - Gets display label for wine type badge
 *
 * @param {string} type - Wine type from database
 * @returns {string} - Display label (Rouge, Blanc, Mousseux, Rosé, Autre)
 */
function getWineTypeLabel(type) {
  const normalizedType = normalizeWineType(type);

  if (normalizedType === 'red wine') return 'Rouge';
  if (normalizedType === 'white wine') return 'Blanc';
  if (normalizedType === 'mousseux') return 'Mousseux';
  if (normalizedType === 'rosé wine') return 'Rosé';

  return 'Autre';
}

/**
 * getWineTypeEmoji - Gets emoji for wine type placeholders
 *
 * @param {string} type - Wine type from database
 * @returns {string} - Emoji character
 */
function getWineTypeEmoji(type) {
  const normalizedType = normalizeWineType(type);

  if (normalizedType === 'red wine') return '🍷';
  if (normalizedType === 'white wine') return '🍾';
  if (normalizedType === 'mousseux') return '✨';
  if (normalizedType === 'rosé wine') return '🌸';

  return '🍇';
}

/**
 * handleImageError - Fallback for failed image loads
 * Replaces failed image with a placeholder
 *
 * @param {jQuery} imgElement - jQuery element of the failed image
 * @param {string} wineType - Wine type for styling placeholder
 */
function handleImageError(imgElement, wineType) {
  const container = imgElement.closest('.wine-image');
  container.empty();

  const wineTypeClass = getWineTypeClass(wineType);
  const placeholder = $('<div class="wine-placeholder"></div>')
    .addClass(`type-${getPlaceholderTypeClass(wineType)}`);

  const typeEmoji = getWineTypeEmoji(wineType);
  placeholder.text(typeEmoji);

  container.append(placeholder);
}

/**
 * navigateToDetails - Navigation helper to go to wine details page
 * Navigates to details page with wine ID as query parameter
 *
 * @param {string} wineId - Wine ID from database
 */
function navigateToDetails(wineId) {
  window.location.href = `/details?id=${wineId}`;
}

/**
 * updateURLParameter - Updates URL query parameter without page reload
 * Updates the browser's URL to reflect current sort state
 *
 * @param {string} param - Parameter name (e.g., 'sort')
 * @param {string} value - Parameter value (e.g., 'type')
 */
function updateURLParameter(param, value) {
  const regex = new RegExp('([?&])' + param + '=.*?(&|$)', 'i');
  const separator = location.search.indexOf('?') !== -1 ? '&' : '?';

  if (regex.test(location.search)) {
    // Replace parameter if it exists
    const newUrl = location.search.replace(regex, '$1' + param + '=' + value + '$2');
    history.replaceState(null, null, location.pathname + newUrl);
  } else {
    // Add parameter if it doesn't exist
    const newUrl = location.pathname + location.search + separator + param + '=' + value;
    history.replaceState(null, null, newUrl);
  }
}
