(function() {
  'use strict';

var ringElem = null;

var win = window;
var doc = document;
var docElem = doc.documentElement;
var body = doc.body;

docElem.addEventListener('keyup', function(event) {
  var code = event.which;
  var target = event.target;

  if (code === 9 || (code > 36 && code < 41)) {
    target.classList.add('is-tabbed');
  }
}, true);

docElem.addEventListener('blur', function(event) {

  var target = event.target;
  target.classList.remove('is-tabbed');
}, true);

})();
