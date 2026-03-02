let action = "mod";
$(document).ready(function () {
  // Get the value of parameter 'id'
  // fetchGrapes();
  // fetchWineTypes();
  // fetchMillesimes();
  // fetchCountries();
  if (getUrlParameter("id")) {
    fetchGrapes(getUrlParameter("id"));
  } else {
    fetchGrapes();
    action = "add";
    $(".addition").show();
    $(".modification").hide();
  }
});

//afterWinesLoad = () => {};

loadValues = () => {
  if (action === "mod") {
    $("#wineName").val(currentWine.name);
    if (currentWine.saqLink) $("#saqLink").attr("href", currentWine.saqLink).show();
    $("#wineCost").val(currentWine.price);
    $("#wineRating").val(currentWine.notation);
    $("#wineComments").val(currentWine.commentary);
    $("#grapes").val(currentWine.grapeVariety);
    $("#region").val(currentWine.region);
    $("#countries").val(currentWine.country);
    console.log($("#countries").val());
    $("#winetypes").val(currentWine.type);
    $("#vintages").val(currentWine.vintage);
    $("#wineImage").attr("src", currentWine.image);
  }
};

updateWineDetails = (wine, callback) => {
  wine.name = $("#wineName").val();
  wine.price = $("#wineCost").val();
  wine.notation = $("#wineRating").val();
  wine.commentary = $("#wineComments").val();
  wine.grapeVariety = $("#grapes").val();
  wine.region = $("#region").val();
  wine.country = $("#countries").val();
  wine.type = $("#winetypes").val();
  wine.vintage = $("#vintages").val();
  callback(wine);
};

validateEntry = () => {
  updateWineDetails(wine, addWine);
};

saveWine = () => {
  updateWineDetails(currentWine, updateWine);
};

cloneWine = (wine) => {
  let newWine = {};
  newWine.name = $("#wineName").val();
  newWine.price = $("#wineCost").val();
  newWine.notation = $("#wineRating").val();
  newWine.commentary = $("#wineComments").val();
  newWine.grapeVariety = $("#grapes").val();
  newWine.region = $("#region").val();
  newWine.country = $("#countries").val();
  newWine.type = $("#winetypes").val();
  newWine.vintage = $("#vintages").val();
  newWine.image = wine.image;
  addWine(newWine);
};

deleteConfirm = () => {
  if (window.confirm("Éliminer " + currentWine.name + "?")) {
    deleteWine(currentWine);
  } else {
    // User clicked Cancel or closed the dialog
    // Optionally, handle this case
  }
};

showLocations = () => {
  window.location.href = "cellar.html?id=" + currentWine._id;
};

uploadCameraPhoto = async (input) => {
  const file = input.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("image", new File([file], currentWine._id + ".jpg", { type: file.type }));
  const response = await fetch("/api/file", { method: "POST", body: formData });
  const filename = await response.text();
  currentWine.image = "/img/" + filename;
  $("#wineImage").attr("src", currentWine.image);
  updateWine(currentWine);
};
