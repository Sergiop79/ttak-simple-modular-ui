'use strict';

(function ($) {
  $('#toggle').click(function() {
        $(this).next('.nav').toggleClass("is-collapsed-mobile");
      });
}(Zepto));
