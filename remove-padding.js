document.addEventListener("DOMContentLoaded", domReady);

function domReady() {
  let getFullWidthSections = document.getElementsByClassName("full-width-section");

  for(let i = 0; i < getFullWidthSections.length; i++) {
    let element = getFullWidthSections[i];
    while (element.classList.contains("Index-page-content") == false || element.classList.contains("Main-content")) {
      element = element.parentNode;
      element.style.padding = 0;
      element.style.margin = 0;
      element.style.maxWidth = "none";
    }

    break;
  }
}