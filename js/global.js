(function() {
  'use strict';

  // Turn links into buttons and turn off default behavior if a11y-toggle
  var a11yButtons = Array.prototype.slice.call(
    document.querySelectorAll('a[data-a11y-toggle]')
  );

  // --
  a11yButtons.forEach(function (a11yButton) {
    a11yButton.setAttribute('aria-role', 'button');
    a11yButton.setAttribute('onclick', 'return false');
  });

  // Connected toggles for a11y-toggle
  function collapse (toggle) {
    var id = toggle.getAttribute('data-a11y-toggle');
    var collapsibleBox = document.getElementById(id);
    collapsibleBox.setAttribute('aria-hidden', true);
    toggle.setAttribute('aria-expanded', false);
  }

  // --
  function collapseAll (event) {
    toggles
      .filter(function (toggle) {
        return toggle !== event.target;
      })
      .forEach(collapse);
  }

  // --
  var toggles = Array.prototype.slice.call(
    document.querySelectorAll('.js-connected-toggles [data-a11y-toggle]')
  );

  // --
  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', collapseAll);
  });

  // Open a11y-toggle from hash
  var hash = window.location.hash.substr(1);
  var currentToggles = Array.prototype.slice.call(
    document.querySelectorAll('[data-a11y-toggle="'+ hash +'"]')
  );
  document.addEventListener('DOMContentLoaded', function () {
    currentToggles.forEach(function (currentToggle) {
      currentToggle.click();
    });
  });

  // Focus on search input
  var searchButton = document.querySelectorAll('[data-a11y-toggle="search"]');
  if(searchButton) {
    for (var sB = 0; sB < searchButton.length; sB++) {

      searchButton[sB].addEventListener('click', function() {

        var className = 'open';

        // Check if has class
        if (this.classList) {
          if(!this.classList.contains(className)) {
            window.setTimeout(function () {
              document.getElementById('edit-keys').focus();
            }, 0);

            // Add class
            if (this.classList) {
              this.classList.add(className);
            }
          } else {

            // Remove class
            if (this.classList) {
              this.classList.remove(className);
            }
          }
        }
      });
    }
  }

  // Change file input attributes to allow styling of file inputs
  var fileInput = document.querySelectorAll('[type="file"]');
  if(fileInput) {
    for (var f = 0; f < fileInput.length; f++) {
      fileInput[f].onchange = function() {
        this.parentNode.setAttribute( 'data-text', this.value.replace(/.*(\/|\\)/, '') );
      };
    }
  }

})();
