let messageCenter;
console.log("index.js loaded");
$(document).ready(function () {
  currentPage = "index";
  messageCenter = $("#messageCenter");
  fetchWines();

  $("#searchWine").on("input", function () {
    // Print entered value in a div box
    filterByName($(this).val());
  });
});

attachClick = () => {
  $(".list-item-container").click(function () {
    // Function to execute when the div is clicked
    var divID = $(this).attr("id");
    window.location = "details?id=" + divID;
  });
};

afterWinesLoad = () => {
  currentWineList = addRatingToJsonArray();
  if (!getUrlParameter("view") || getUrlParameter("view") === "stock") {
    fetchCurrentStock();
    messageCenter.html("Notre inventaire");
  } else if (getUrlParameter("view") === "all") {
    messageCenter.html("Tous les vins enregistrés");
  } else if (getUrlParameter("view") === "red") {
    setCurrentWineList("group", "Rouge");
    messageCenter.html("Les rouges");
  } else if (getUrlParameter("view") === "white") {
    setCurrentWineList("group", "Blanc");
    messageCenter.html("Les blancs");
  } else if (getUrlParameter("view") === "bubbly") {
    setCurrentWineList("group", "Mousseux");
    messageCenter.html("Les mousseux");
  }

  filterByName("");
};

sortName = () => {
  filteredWines.sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  buildList();
};

sortOrder = "decending";
// sortName = () => {
//   filteredWines.sort = () => {
//     if (sortOrder === "decending") {
//       filteredWines.sort((a, b) => a.name.toUpperCase() - b.name.toUpperCase());
//       sortOrder = "ascending";
//     } else {
//       filteredWines.sort((a, b) => b.name.toUpperCase() - a.name.toUpperCase());
//       sortOrder = "decending";
//     }

//     buildList();
//   };
// };

sort = (target) => {
  if (sortOrder === "decending") {
    filteredWines.sort((a, b) => a[target] - b[target]);
    sortOrder = "ascending";
  } else {
    filteredWines.sort((a, b) => b[target] - a[target]);
    sortOrder = "decending";
  }

  buildList();
};
