import $ from "jquery";

$(document).ready(function() {
  $(".picList .pic").click(function() {
    $(".picList .pic").removeClass("on");
    $(this).addClass("on");
  });
  $(".picList .pic").hover(function() {
    $(".picList .pic").removeClass("on");
    $(this).addClass("on");
  });
});
