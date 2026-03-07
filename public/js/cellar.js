$(document).ready(function () {
  currentPage = "cellar";
  fetchWines();

  $("#searchWine").on("input", function () {
    // Print entered value in a div box
    filterByName($(this).val());
  });
});
afterWinesLoad = () => {
  currentWineList = wines;
  filterByName("");
  fetchLocations();
};
attachClick = () => {
  $(".list-item-container").click(function () {
    addWineToCellar($(this).attr("id"), $(this).attr("group"));
  });
};

let locations = [];
let currentLocationID;
function fetchLocations() {
  locations = [];
  wines.forEach(wine => {
    if (Array.isArray(wine.cellarLocation)) {
      wine.cellarLocation.forEach(locId => {
        locations.push({ _id: locId, wineid: wine._id.toString(), winegroup: wine.type });
      });
    }
  });
  refreshView();
}

refreshView = () => {
  wineModal.hide();
  wineListModal.hide();
  getDivIDs();
  countSpots();
};

let cellarEmptySpots = 55;
let KitchenEmptySpot = 20;
let cellarLoadedSpots = 0;
let KitchenLoadedSpot = 0;
countSpots = () => {
  locations.forEach(function (item) {
    if (item.wineid != "") {
      if (item._id.startsWith("k")) KitchenEmptySpot = KitchenEmptySpot - 1;
      else cellarEmptySpots = cellarEmptySpots - 1;
    }
  });
  cellarLoadedSpots = 55 - cellarEmptySpots;
  KitchenLoadedSpot = 20 - KitchenEmptySpot;
  $("#kitchenCount").html(
    "Cuisine contient:" + KitchenLoadedSpot + " libre:" + KitchenEmptySpot
  );
  $("#cellarCount").html(
    "Cellier contient:" + cellarLoadedSpots + " libre:" + cellarEmptySpots
  );
};

getDivIDs = () => {
  $("div.c_winerack").each(function () {
    dressLocation($(this), 1);
  });
  $("div.octagon").each(function () {
    dressLocation($(this), 2);
  });
  $("div.c_shelves").each(function () {
    dressLocation($(this), 2);
  });
};

takeWine = () => {
  let objectToModify = locations.find(function (item) {
    return item._id === currentTargetElement.attr("id");
  });
  if (objectToModify) {
    objectToModify["wineid"] = "";
    updateLocation(objectToModify, currentWine._id);
    currentTargetElement.attr("wineid", "");
    currentTargetElement.removeClass().addClass("bottle empty-bottle");
  } else {
    console.error("Object with id", id, "not found in the JSON array.");
  }
};

let targettedLocations = [];

addWineToCellar = (wineid) => {
  selectedLocations.forEach(function (item) {
    let location = {};
    location._id = item;
    targettedLocations.push(location);
  });
  updateLocations(targettedLocations, wineid);
  currentWine = getWine(wineid);
  // let location = getLocation(currentLocationID);
  // location["wineid"] = wineid;
  // location["winegroup"] = group;
  //
  //

  // console.log("current" + currentWine);
};
