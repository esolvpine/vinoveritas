toggleMenu = () => {
  var menuList = document.getElementById("menu-items");
  menuList.classList.toggle("active");
  document.getElementById("main").classList.toggle("active-menu");
};

// Create the main menu container
var $menuItems = $("<div>", {
  id: "menu-items",
  class: "menu-list",
});

// Create the menu items
var menuItems = [];

// Create the menu item divs and append them to the main container
// Get the current URL
var currentURL = window.location.href;
// Split the URL into an array
var urlParts = currentURL.split("/");
// Get the last part of the URL
var lastPart = urlParts[urlParts.length - 1];
// Remove the query parameters, if any
var lastPartWithoutParams = lastPart.split("?")[0];
// Log the result
console.log(lastPartWithoutParams);

if (lastPartWithoutParams === "activities") {
  menuItems = [
    {
      text: "Acceuil",
      onclick: "fetchCurrentAll('');messageCenter.html('Tous les vins enregistrés');filterByName('');",
    },
    { text: "Cellier", onclick: "window.location.href='cellar';" },
    { text: "Ajouter un vin", onclick: "window.location.href='details';" },
  ];
  $(".hamburger-menu").append($menuItems);
} else if (lastPartWithoutParams === "details") {
  menuItems = [
    {
      text: "Acceuil",
      onclick: "fetchCurrentAll('');messageCenter.html('Tous les vins enregistrés');filterByName('');",
    },
    { text: "Cellier", onclick: "window.location.href='cellar';" },
    { text: "Ajouter un vin", onclick: "window.location.href='details';" },
  ];
  $(".hamburger-menu").append($menuItems);
} else if (lastPartWithoutParams === "cellar") {
  menuItems = [
    {
      text: "Acceuil",
      onclick:
        "fetchCurrentAll('');messageCenter.html('Tous les vins enregistrés');filterByName('');",
    },
    { text: "Ajouter un vin", onclick: "window.location.href='details';" },
  ];
  $(".hamburger-menu").append($menuItems);
} else if (
  lastPartWithoutParams === "" ||
  lastPartWithoutParams === "index"
) {
  menuItems = [
    {
      text: "En inventaire",
      onclick:
        "fetchCurrentStock();messageCenter.html('Notre inventaire');filterByName('');",
    },
    {
      text: "Tous",
      onclick:
        "fetchCurrentAll('');messageCenter.html('Tous les vins enregistrés');filterByName('');",
    },
    {
      text: "Rouge",
      onclick:
        "setCurrentWineList('type','Red wine');messageCenter.html('Les rouges');filterByName('');",
    },
    {
      text: "Blanc",
      onclick:
        "setCurrentWineList('type','White wine');messageCenter.html('Les blancs');filterByName('');",
    },
    {
      text: "Mousseux",
      onclick:
        "setCurrentWineList('type','Sparkling wine');messageCenter.html('Les mousseux');filterByName('');",
    },
    { text: "Ajouter un vin", onclick: "window.location.href='details';" },
    { text: "Activités", onclick: "window.location.href='activities';" },
    { text: "Cellier", onclick: "window.location.href='cellar';" },
  ];
  $(".hamburger-menu").append($menuItems);
}

// Append the main menu container to the desired location in the DOM
menuItems.forEach(function (item) {
  var $menuDiv = $("<div>", {
    class: "inner-menu-div",
    text: item.text,
    click: function () {
      eval(item.onclick);
    },
  });
  $menuItems.append($menuDiv);
});
