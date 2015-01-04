/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/

/*start:*********** abhishekkr.github.io/j ******************/
function $DOM(a,b){var c=document.querySelectorAll(a);if(b===undefined){b=0}return c[b]}
function loadURI(a){var b=new XMLHttpRequest();b.open("GET",a,false);b.send();return b.responseText}
/*end:************* abhishekkr.github.io/j ******************/

/* update tag-IDs with respective text */
function updateTextIfKey(dict, key){
  if(dict.hasOwnProperty(key)){
    $("#" + key).text(dict[key]);
  }
}
/* update top navigation bar */
function updateNavBar(dict, nav_key){
  var nav_html = "";
  if(dict.hasOwnProperty(nav_key)){
    var nav_bars = dict[nav_key];
    for(var nav_idx in nav_bars){
      var _nav = nav_bars[nav_idx];
      nav_html += "<li><a id=\"" + _nav["id"] +"\" href=\"" + _nav["url"] + "\" class=\"button\">" + _nav["text"] + "</a></li>"
    }
  }
  $("#navbar_buttons").html(nav_html);
}
/* update side navigation bar */
function updateSideNavBar(dict, nav_key){
  var nav_html = "";
  if(dict.hasOwnProperty(nav_key)){
    var nav_bars = dict[nav_key];
    for(var nav_idx in nav_bars){
      var _nav = nav_bars[nav_idx];
      nav_html += "<li><a href=\"" + _nav["url"] + "\" class=\"sidenav\">" + _nav["text"] + "</a></li>"
    }
  }
  $("#sidenavbar_buttons").html(nav_html);
}
/* update featured blog bar */
function updateFeaturedBlogBar(dict, nav_key){
  var nav_html = "";
  if(dict.hasOwnProperty(nav_key)){
    var _nav = dict[nav_key];
    nav_html += "<a href=\"" + _nav["url"] + "\" class=\"featured\">" + _nav["name"] + "</a>: " + _nav["intro"]
  }
  $("#featured_blog").html(nav_html);
}

var baseinfo_json_file =  "./baseinfo.json"
$.ajax({
    url: baseinfo_json_file,
    dataType: 'json',
    async: false,
    success: function(json_data) {
      if(json_data.hasOwnProperty("title")){
        document.title = json_data["title"]
      }
      updateTextIfKey(json_data, "datumBanner");
      updateTextIfKey(json_data, "datumSubtitle");
      updateNavBar(json_data, "navbar");
      updateSideNavBar(json_data, "sidenavbar");
      updateFeaturedBlogBar(json_data, "featured");
    }
}).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
});

