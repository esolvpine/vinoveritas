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
  window.location.href='https://vino.esolv.ca?splash=hide'
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

    myList.appendChild(listItem);
    listItem.setAttribute("group", item.type);
    let current = $("#" + item._id);
    current.className = "list-inner-container";

    current.html(item.qty + " x " + item.name + " " + item.vintage+ " " + item.notation+"/10");
    // let starsDiv = $("<div id='stars" + item._id + "'></div>").addClass(
    //   "stars-container"
    // );
    // current.append(starsDiv);
    // starsDiv.append(generateStars(item.notation, starsDiv));
  });
  attachClick();
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
