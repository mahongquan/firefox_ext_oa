(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  // if (window.hasRun) {
  //   return;
  // }
  // console.log(window.hasRun);
  // window.hasRun = true;
  console.log($);
  $("#login_username").val("mahongquan");
  $("#login_password").val("mhq730208");
  $("#login_button")[0].click();
})();
