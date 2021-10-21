"use strict";

document.addEventListener("DOMContentLoaded", domReady);
var conditionInput = null;
var makeInput = null;
var modelInput = null;
var zipInput = null;
var formSubmit = null;
var requiredText = null;
var requiredZip = null;
var populateSelectedModels = null;
var apiData = {};
var hasErrors = false;
var fieldSelects = []; // perform functions when dom is ready

function domReady() {
  var ccForm = document.getElementById("site-cc");
  var makesArray = [];
  var modelsArray = []; // hit api and get data

  var request = new XMLHttpRequest();
  request.open('GET', "https://autolink.io/vsufcu/cbs/makesModels", true);

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        console.log("success");
        var data = JSON.parse(this.responseText);
        apiData = data; // load default zip

        if (apiData.defaultZip != undefined) {
          zipInput.parentElement.classList.remove("validate-error");
          zipInput.value = apiData.defaultZip;
        }

        loadMakes(data);
      } else {
        console.log("error");
      }

      console.log("complete");
    }
  };

  request.send();
  request = null; // get data for makes

  function loadMakes(data) {
    var apiValuesValues = Object.values(apiData);
    var theMakes = Object.keys(apiData);
    apiValuesValues.forEach(function (element) {
      makesArray.push(Object.keys(element));
    });
    makesArray = makesArray[0].sort();
    populateMakes(makesArray);
  } // add dom elements for makes


  function populateMakes(makesArray) {
    var makeDropdown = document.getElementById('cc-make-dd');
    makesArray.forEach(function (element) {
      var childNode = document.createElement("div");
      childNode.innerHTML = element;
      childNode.setAttribute("tabindex", "0");
      makeDropdown.appendChild(childNode);
    });
    createDropdownListeners(makeInput, true);
  } // add dom elements for models


  populateSelectedModels = function populateSelectedModels(selectedMake) {
    var theModels = Object.values(apiData);
    var selectedModels = [];

    for (var i = 0; i < theModels.length; i++) {
      Object.keys(theModels[i]).forEach(function (val) {
        if (selectedMake == val) {
          selectedModels = theModels[i][val];
        }
      });
    }

    var modelDropdown = document.getElementById("cc-model-dd");
    modelDropdown.innerHTML = "";
    var childNodeAll = document.createElement("div");
    childNodeAll.innerHTML = "All";
    childNodeAll.setAttribute("tabindex", "0");
    modelDropdown.appendChild(childNodeAll);
    selectedModels.forEach(function (element) {
      var childNode = document.createElement("div");
      childNode.innerHTML = element;
      childNode.setAttribute("tabindex", "0");
      modelDropdown.appendChild(childNode);
    });
    createDropdownListeners(modelInput, false);
  }; // get input elements


  conditionInput = document.getElementById("cc-condition");
  makeInput = document.getElementById("cc-make");
  modelInput = document.getElementById("cc-model"); // create event listeners for input dropdowns

  createDropdownListeners(conditionInput, false);
  createDropdownListeners(modelInput, false); // get zip input element

  zipInput = document.getElementById("cc-zip");
  fieldSelects = [conditionInput, makeInput, modelInput, zipInput];
  var zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/; // clear placeholder text on zip input

  zipInput.addEventListener("focus", function (event) {
    event.preventDefault();
    zipInput.placeholder = "";
  }); // add back placeholder text on zip input

  zipInput.addEventListener("blur", function (event) {
    event.preventDefault();

    if (zipInput.value != "") {
      zipInput.parentElement.classList.remove("validate-error");

      if (zipRegex.test(zipInput.value) === true) {
        zipInput.parentElement.classList.remove("validate-zip-error");
        requiredZip.style.display = "none";
      } else {
        zipInput.parentElement.classList.add("validate-zip-error");
        requiredZip.style.display = "block";
      }

      howManyErrors();
    } else {
      zipInput.parentElement.classList.add("validate-error");
      zipInput.parentElement.classList.add("validate-zip-error");
      requiredZip.style.display = "block";
    }

    zipInput.placeholder = "Zip Code";
  }); // get sumbit button 

  formSubmit = document.getElementById("form-submit");
  requiredText = document.getElementById("required-field");
  requiredZip = document.getElementById("required-zip"); // handle submit button clicks

  formSubmit.addEventListener("click", function (event) {
    checkForm();
  }); // handle submit button keyups

  formSubmit.addEventListener("keyup", function (event) {
    event.preventDefault();

    if (event.keyCode === 13 || event.key === 'Enter') {
      checkForm();
    }
  }); // check for validation erros

  function checkForm() {
    var inputList = [conditionInput, makeInput, modelInput, zipInput];

    if (zipRegex.test(zipInput.value) === false) {
      requiredZip.style.display = "block";
      zipInput.parentElement.classList.add("validate-zip-error");
      hasErrors = true;
    }

    inputList.forEach(function (element) {
      if (element.value === "") {
        element.parentElement.classList.add("validate-error");
        requiredText.style.display = "block";
        hasErrors = true;
      }
    });
    submitSearch();
    formSubmit.blur();
  }
} // assign event listeners for dropdown input fields


function createDropdownListeners(inputElement, isMakes) {
  var inputText = inputElement.children[0];
  var fieldDropdown = inputElement.children[1]; // fix focus in safari

  inputElement.addEventListener("mouseup", function (event) {
    event.preventDefault();
    inputElement.focus();
  });
  var dropdownItems = fieldDropdown.children; // for each dropdown handle focus events and validation

  var _loop = function _loop(i) {
    var currentElement = dropdownItems[i]; // select dropdown element on click

    currentElement.addEventListener("click", function (event) {
      event.preventDefault();
      selectElement();
    }); // select dropdown element on enter and move focus

    currentElement.addEventListener("keyup", function (event) {
      event.preventDefault();

      if (event.keyCode === 13 || event.key === 'Enter') {
        var focusLocation = fieldSelects.indexOf(inputElement);

        if (focusLocation === 3) {} else {
          focusLocation++;
          fieldSelects[focusLocation].focus();
        }

        selectElement();
      }
    }); // select item from dropdown

    function selectElement() {
      inputElement.setAttribute("value", currentElement.innerHTML);
      inputText.innerHTML = currentElement.innerHTML;
      inputText.style.color = "#000000";

      if (isMakes === true) {
        populateSelectedModels(currentElement.innerHTML);
      }

      if (inputElement.parentElement.classList.contains("validate-error")) {
        inputElement.parentElement.classList.remove("validate-error");
      }

      howManyErrors();
      inputElement.blur();
    }
  };

  for (var i = 0; i < dropdownItems.length; i++) {
    _loop(i);
  }
} // check if there are any validation errors and remove error text


function howManyErrors() {
  var howManyErrors = document.getElementsByClassName("validate-error");

  if (howManyErrors.length === 0) {
    requiredText.style.display = "none";
    hasErrors = false;
  } else {
    hasErrors = true;
  }
} // submit form


function submitSearch() {
  // if no errors open car commander
  if (hasErrors === false) {
    //window.open('https://autolink.io/vsufcu/cbs/search/'+ makeInput.value + '/' + modelInput.value + '/' + conditionInput.value + '/' + zipInput.value , "_self");
    window.open("https://www.vsufcu.org/car-commander#CarBuyingServicePage=/search;condition=" + conditionInput.value + ';makes=' + makeInput.value + ';models=' + modelInput.value + ';zip=' + zipInput.value, "_self");
  }
}
