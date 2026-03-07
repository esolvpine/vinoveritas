// {
//   _id: String,
//   name: String,
//   vintage: Number,
//   qty: Number,
//   group: String,
//   grapeVariety: String,
//   positions: [],
//   price: Number,
//   country: String,
//   region: String,
//   commentary: String,
//   notation: Number,
//   img: String,
// }
let wines = [];
let currentWine;
let wine = {};
let filteredWines = [];
let grapes = [];
let winetypes = [];
let vintages = [];
let countries = [];
let theURL = "/api/";
let stockCount = 0;

async function loadWines() {
  const response = await fetch(theURL + "wines");
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const data = await response.json();
  wines = data.obj;
  wines.forEach((item) => {
    if (!item.notation || item.notation === null) item.notation = 0;
    item.qty = Array.isArray(item.cellarLocation) ? item.cellarLocation.length : 0;
  });
}

async function fetchWines() {
  try {
    await loadWines();
    countStock();
    afterWinesLoad();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

countStock = () => {
  wines.forEach((item) => {
    stockCount += item.qty;
  });
};

async function fetchWine(wineID) {
  try {
    const response = await fetch(theURL + "wines/" + wineID); // Replace with your REST API URL
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Extract JSON from the response
    currentWine = data.obj[0];
    loadValues();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchGrapes(wineID) {
  try {
    await loadWines();
    grapes = [...new Set(wines.map(w => w.grapeVariety).filter(Boolean))].sort();
    populateDropdown("grapes", grapes);
    fetchCountries(wineID);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchActivities() {
  try {
    const response = await fetch("/api/wines/activities");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function fetchCountries(wineID) {
  countries = [...new Set(wines.map(w => w.country).filter(Boolean))].sort();
  populateDropdown("countries", countries);
  fetchWineTypes(wineID);
}
function fetchWineTypes(wineID) {
  winetypes = [...new Set(wines.map(w => w.type).filter(Boolean))].sort();
  populateDropdown("winetypes", winetypes);
  fetchMillesimes(wineID);
}

function fetchMillesimes(wineID) {
  vintages = [...new Set(wines.map(w => w.vintage).filter(Boolean))].sort((a, b) => b - a);
  populateDropdown("vintages", vintages);
  fetchWine(wineID);
}

updateLocation = (loc, wineid) => {
  $.ajax({
    url: theURL + "locations/update",
    type: "POST",
    data: JSON.stringify(loc),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
      let currentWine = wines.find((item) => item._id === wineid);
      currentWine.qty = currentWine.qty - 1;
      updateWineRemove(currentWine);
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
};
updateLocations = (locations, wineid) => {
  let updatedQty = locations.length;
  let payload = {};
  payload.locations = locations;
  payload.wineid = wineid;
  $.ajax({
    url: theURL + "locations/updateMany",
    type: "POST",
    data: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
      let currentWine = wines.find((item) => item._id === wineid);
      if (!Array.isArray(currentWine.cellarLocation)) currentWine.cellarLocation = [];
      locations.forEach((loc) => {
        if (!currentWine.cellarLocation.includes(loc._id))
          currentWine.cellarLocation.push(loc._id);
      });
      currentWine.qty = currentWine.qty + updatedQty;
      updateWine(currentWine);
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
};
updateWine = (wine) => {
  console.log("update wine: " + wine);
  $.ajax({
    url: theURL + "wines/update",
    type: "POST",
    data: JSON.stringify(wine),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
     /// alert("Le vin a été modifié");
      location.reload(true);
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
};

updateWineRemove = (wine) => {
  console.log("update wine: " + wine);
  $.ajax({
    url: theURL + "wines/updateremove",
    type: "POST",
    data: JSON.stringify(wine),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
      alert("");
      location.reload(true);
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
};

addWine = (wine) => {
  wine.qty = 0;
  $.ajax({
    url: theURL + "wines/add",
    type: "POST",
    data: JSON.stringify(wine),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
      //alert("Le vin a été ajouté");
      window.location.href = "/details?id=" + response;
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
};
/* addWine = (wine) => {
  wine.qty = 0;
  $.ajax({
    url: theURL + "wines/add",
    type: "POST",
    data: JSON.stringify(wine),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (response) {
      alert("Le vin a été ajouté");
      window.location.href = "views/details.html?id=" + response; // Updated path
    },
    error: function (xhr, status, error) {
      console.error("Error posting JSON array:", error);
    },
  });
}; */
deleteWine = (wine) => {
  $.ajax({
    url: theURL + "wines/delete",
    type: "POST",
    data: JSON.stringify(wine),
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function () {
      window.location.href = "/";
    },
    error: function (_, __, error) {
      console.error("Error deleting wine:", error);
    },
  });
};

getWine = (id) => {
  wine = wines.find(function (item) {
    return item._id === id;
  });
  return wine;
};

