let currentTargetElement;

getLocation = (id) => {
  let loc = locations.find(function (item) {
    return item._id === id;
  });
  // [1][2];
  return loc;
};

dressLocation = (el) => {
  let id = el.attr("id");
  if (id.startsWith("f"));
  let matchingType = getLocation(id);
  let additionalCSS = "";
  target = el.children(":first-child");
  if (id.startsWith("c")) {
    additionalCSS = "bottle";
    if (id.startsWith("cc")) additionalCSS = "bottle bottle_rotate";
  } //Octogon
  else {
    target = target.children(":first-child");
    additionalCSS = "circleBottle ";
  }
  
  if (!matchingType) {
    target.attr("class", "bottle " + additionalCSS + " empty-bottle");
    return null;
  }
  if (matchingType.wineid === "")
    target.attr("class", additionalCSS + " empty-bottle");
  else if (matchingType) {
    
    if (matchingType.winegroup === "")
      target.attr("class", additionalCSS + " empty-bottle");
    else {
      if (
        getUrlParameter("id") &&
        getUrlParameter("id") === matchingType.wineid
      ) {
        target.attr("class", additionalCSS + " green-bottle");
      } else {
        let wine = wines.find((item) => item._id === matchingType.wineid);
        matchingType.winegroup = wine.type;
        let wineTypeNorm = normalizeWineType(matchingType.winegroup);
        if (wineTypeNorm === "red wine")
          target.attr("class", additionalCSS + " red-bottle");
        else if (wineTypeNorm === "white wine")
          target.attr("class", additionalCSS + " white-bottle");
        else if (wineTypeNorm === "rosé wine" || wineTypeNorm === "rose wine")
          target.attr("class", additionalCSS + " rose-bottle");
        else if (wineTypeNorm === "mousseux" || wineTypeNorm === "sparkling wine")
          target.attr("class", additionalCSS + " bubbly-bottle");
      }
      el.attr("wineid", matchingType.wineid);
    }
  } else {
    target.attr("class", "bottle " + additionalCSS + " empty-bottle");
    return null; // or return a default value if no match is found
  }
};

locationDressing = () => {};
let selectedLocations = [];

pickLocation = (el) => {
  $("#searchWine").val("");
  let current = $("#" + el.id);
  currentTargetElement = current;
  currentLocationID = el.id;
  let wineId = current.attr("wineid");
  if (wineId != "") {
    currentWine = wines.find(function (item) {
      return item._id === wineId;
    });
    $("#wineModal .modal-content").css("background-image", "url(" + currentWine.image + ")");
    $("#winename").html(currentWine.name + " (" + currentWine.vintage + ")");
    $("#wineqty").html(currentWine.qty);
    $("#wineprice").html("$" + currentWine.price);
    wineModal.show();
  } else {
    let idx = selectedLocations.indexOf(currentLocationID);
    if (idx !== -1) {
      selectedLocations.splice(idx, 1);
      currentTargetElement.css("background", "");
      if (selectedLocations.length === 0) $("#addTrigger").hide();
    } else {
      selectedLocations.push(currentLocationID);
      currentTargetElement.css("background", "aqua");
      $("#addTrigger").show();
    }
  }
};

addWinetoCellar = () => {
  $("#addTrigger").hide();
  wineListModal.show();
};
