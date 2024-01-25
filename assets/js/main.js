const menu = document.getElementById("menu");

Array.from(document.getElementsByClassName("menu-item"))
.forEach((item, index) => {
  item.onmouseover = () => {
    menu.dataset.activeIndex = index;
  }
});


// document.addEventListener('DOMContentLoaded', function () {
//   // Get all elements with class "menu-item"
//   var menuItems = document.querySelectorAll('.menu-item');

//   // Add click event listener to each menu item
//   menuItems.forEach(function (item) {
//     item.addEventListener('click', function (event) {
//       // Get the value of the data-href attribute
//       var href = item.getAttribute('data-href');

//       // Update the URL without triggering a page reload
//       history.pushState({}, '', href);

//       fetchContent(href);


//       // Prevent the default link behavior
//       event.preventDefault();
//     });
//   });

//   function fetchContent(url) {
//     // Fetch the content from the provided URL
//     fetch(url)
//         .then(response => response.text())
//         .then(data => {
//             // Update the main content area with the fetched content
//             document.querySelector('.content').innerHTML = data;
//         })
//         .catch(error => {
//             console.error('Error fetching content:', error);
//         });
//   }

  
// });
