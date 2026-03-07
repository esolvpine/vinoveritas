// Function to get URL parameter by name
getUrlParameter = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

populateDropdown = (elID, arr) => {
  var dropdown = $("#" + elID);
  dropdown.append(
    $("<option>", {
      value: "Choisir",
      text: "Choisir",
    })
  );
  // Iterate over the wines array and add options to the dropdown
  $.each(arr, function (_, item) {
    dropdown.append(
      $("<option>", {
        value: item.name,
        text: item.name,
      })
    );
  });
  dropdown.val("Choisir");
};

sortMillesime = () => {
  let currentStock = wines.filter(function (obj) {
    return obj["qty"] > 1;
  });
  currentWineList = currentStock.sort(function (a, b) {
    return a.vintage - b.vintage;
  });
};

sortPreferred = () => {
  var correctedList = addRatingToJsonArray();
  currentWineList = correctedList.sort(function (a, b) {
    return b.notation - a.notation;
  });
};

addRatingToJsonArray = () => {
  return wines.map(function (item) {
    if (!("notation" in item)) {
      return { ...item, notation: 0 };
    }
    return item;
  });
};

normalizeWineType = (type) => {
  if (!type) return '';
  const t = type.toLowerCase().trim();
  if (t.startsWith('red')) return 'red wine';
  if (t.startsWith('white')) return 'white wine';
  if (t.startsWith('sparkling') || t.startsWith('mousseux')) return 'mousseux';
  if (t.startsWith('rosé') || t.startsWith('rose')) return 'rosé wine';
  return t;
};

// jQuery
