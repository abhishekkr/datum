/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/


function updateTextIfKey(dict, key){
  if(dict.hasOwnProperty(key)){
    $("#" + key).text(dict[key]);
  }
}
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

var baseinfo_json_file =  "./www-data/baseinfo.json"
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
    }
}).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
});

