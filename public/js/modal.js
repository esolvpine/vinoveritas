// Get the modal
let wineModal = $("#wineModal");
let wineListModal = $("#wineListModal");
let uploadFileModal = $("#wineListModal");
var closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function () {
  wineModal.hide();
};




// Example usage:
// openModal(); // Call this function to open the modal

// modal.addEventListener("show", preventPageScroll);
// modal.addEventListener("hide", allowPageScroll);

// function preventPageScroll() {
//   // Get the current scroll position
//   const scrollY = window.pageYOffset || document.documentElement.scrollTop;

//   // Set the body's position to fixed and save the scroll position
//   document.body.style.position = "fixed";
//   document.body.style.top = `-${scrollY}px`;
//   document.body.style.width = "100%";

//   // Disable scrolling on the body
//   document.body.style.overflow = "hidden";
// }

// function allowPageScroll() {
//   // Restore the body's position and scroll position
//   const scrollY = parseInt(document.body.style.top, 10) * -1;
//   document.body.style.position = "";
//   document.body.style.top = "";
//   document.body.style.width = "";
//   document.body.style.overflow = "";

//   // Scroll to the saved position
//   window.scrollTo(0, scrollY);
// }
