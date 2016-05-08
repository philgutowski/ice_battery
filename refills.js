var expanderContainers = document.getElementsByClassNames('')

$(document).ready(function() {
  $('.expander-trigger').click(function(){
    $(this).toggleClass("expander-hidden");
  });
});