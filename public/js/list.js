let currentWineList = [];

setCurrentWineList = (attribute, value) => {
  // Find the object in the array that matches the given attribute and value
  currentWineList = wines.filter(function (obj) {
    if (attribute === 'type') {
      return normalizeWineType(obj[attribute]) === normalizeWineType(value);
    }
    return obj[attribute] === value;
  });
};

fetchCurrentStock = () => {
  currentWineList = wines.filter(function (obj) {
    return obj["qty"] != 0;
  });
};

fetchCurrentAll = () => {
  window.location.href='/?splash=hide'
  currentWineList = wines;
  messageCenter.html('Tous les vins enregistrés');filterByName('');

};



filterByName = (filter) => {
  filteredWines = $.grep(currentWineList, function (element) {
    return element.name.toLowerCase().includes(filter.toLowerCase());
  });
  buildList();
};
buildList = () => {
  let myList = document.getElementById("list-container");
  $("#list-container").empty();

  filteredWines.forEach((item) => {
    let listItem = document.createElement("div");
    listItem.id = item._id;
    listItem.className = "list-item-container";
    listItem.setAttribute("group", item.type);

    // Get wine type class for badge color
    const wineTypeClass = getWineTypeClass(item.type);

    // Create modern structured layout
    const qtyBadge = `<div class="wine-qty-badge ${wineTypeClass}">${item.qty}</div>`;

    const wineInfo = `
      <div class="wine-info-content">
        <div class="wine-name-text">${item.name}</div>
        ${item.vintage ? `<div class="wine-meta"><span class="vintage-year">${item.vintage}</span></div>` : ''}
      </div>
    `;

    const scoreDisplay = item.notation && item.notation > 0
      ? `<div class="wine-score-badge">${item.notation}</div>`
      : `<div class="wine-score-badge wine-score-empty">—</div>`;

    listItem.innerHTML = `
      <div class="list-inner-container">
        ${qtyBadge}
        ${wineInfo}
        ${scoreDisplay}
      </div>
    `;

    myList.appendChild(listItem);
  });
  attachClick();
};

// Helper function to get wine type class for badge colors
getWineTypeClass = (type) => {
  const typeMap = {
    'Red wine': 'wine-type-red',
    'White wine': 'wine-type-white',
    'Rosé wine': 'wine-type-rose',
    'Sparkling wine': 'wine-type-sparkling',
    'Dessert wine': 'wine-type-dessert'
  };
  return typeMap[type] || 'wine-type-default';
};
// Create a new array based on the partial match of the name element

generateStars = (number, el) => {
  if (number >= 1 && number <= 5) {
    if (Number.isInteger(number)) {
      for (let i = 1; i <= number; i++) {
        el.append(star.clone());
      }
    } else {
      for (let i = 1; i <= number; i++) {
        el.append(star.clone());
      }
      el.append(halfStar.clone());
    }
  }
};
