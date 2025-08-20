(function (global) {

  var dc = {};

  // URLs for JSON data
  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

  // -------- Utility function to insert HTML --------
  function insertHtml(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  }

  // -------- Show loading icon --------
  function showLoading(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }

  // -------- Replace {{propName}} in snippet --------
  function insertProperty(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  // -------- Choose a random category --------
  function chooseRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  // -------- On page load --------
  document.addEventListener("DOMContentLoaded", function (event) {
    // Show loader in #main-content
    showLoading("#main-content");

    // Load categories to pick a random one
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        // Once categories are loaded, get home snippet
        $ajaxUtils.sendGetRequest(
          homeHtmlUrl,
          function (homeHtml) {
            // Pick a random category short_name
            var chosenCategoryShortName =
              chooseRandomCategory(categories).short_name;

            // Replace placeholder in home snippet
            var homeHtmlToInsertIntoMainPage =
              insertProperty(homeHtml,
                "randomCategoryShortName",
                "'" + chosenCategoryShortName + "'");

            // Insert into #main-content
            insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
          },
          false); // Don't want JSON, just HTML
      });
  });

  // -------- Load menu items of a category --------
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML);
  };

  // -------- Build menu items page --------
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    $ajaxUtils.sendGetRequest(
      "snippets/single-category-snippet.html",
      function (singleCategoryHtml) {
        var finalHtml = singleCategoryHtml;

        // Insert category details
        finalHtml = insertProperty(finalHtml,
          "name", categoryMenuItems.category.name);
        finalHtml = insertProperty(finalHtml,
          "special_instructions",
          categoryMenuItems.category.special_instructions);

        // Insert menu items list
        var menuItems = categoryMenuItems.menu_items;
        for (var i = 0; i < menuItems.length; i++) {
          finalHtml +=
            "<p><b>" + menuItems[i].name + "</b>: " +
            menuItems[i].description + "</p>";
        }

        // Insert final HTML
        insertHtml("#main-content", finalHtml);
      },
      false);
  }

  // Expose to global
  global.$dc = dc;

})(window);
