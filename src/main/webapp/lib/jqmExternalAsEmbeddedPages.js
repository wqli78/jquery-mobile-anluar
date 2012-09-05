/**
 * Patch for jquery mobile to transparently lookup non existing embedded pages
 * as external pages with the suffix .html.
 */
define(["jquery", "jquery.mobile"], function($) {
  var tempPage;

  function createTemporaryPageFromLocationHashSoThatJqmCallsLoadPage() {
    var tempPageId = $.mobile.path.stripHash(location.hash);
    if (tempPageId && !$('#'+tempPageId).length) {
      $(document).bind("pagecontainercreate", function() {
        tempPage = $('<div data-role="page" id="'+tempPageId+'"></div>');
        $.mobile.pageContainer.append(tempPage);
      });
    }
  }

  $.mobile.originalLoadPage = $.mobile.loadPage;
  $.mobile.loadPage = function (url, options) {
    if (tempPage) {
        tempPage.remove();
    }
    var match = url.match(/#(\w+)/);
    if (match) {
      var pageId = match[1];
      var page = document.getElementById(pageId);
      if (!page || $(page).is(":jqmData(external-page='true')")) {
        url = pageId + ".html";
      }
    }
    return $.mobile.originalLoadPage(url, options);
  };
});



