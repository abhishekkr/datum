/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/

var baseinfo_json_file =  "./www-data/baseinfo.json"
$.ajax({
    url: baseinfo_json_file,
    dataType: 'json',
    async: false,
    success: function(json_data) {
      for(var key in json_data){
        $("#" + key).text(json_data[key]);
      }
    }
}).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
});



/**************** listifying **********************/

function openNew(self){
  window.open(self.innerHTML);
  return false;
}

var blogEntries = [];
var options = {
  valueNames: [ 'blogTitle', 'blogFile', 'blogTags', 'blogDate' ],
  item: '<li><article> <a class="blogTitleLink" src="#"><h3 class="blogTitle"></h3></a> <div class="blogDate"></div> <a class="blogFile" href="javascript:void(0)" onclick="openNew(this);" onkeypress="openNew(this);"></a> <p class="blogTags"></p> </article> <hr/></li>',
  page: 10,
  plugins: [ ListPagination({}), ListFuzzySearch() ]
};


/* add all elements from loaded list */
function update_list(this_item){
  blogEntries.push({
    blogTitle: this_item.blogTitle,
    blogFile: this_item.blogFile,
    blogTags: this_item.blogTags
  });
}

var datum_json_file =  "./www-data/datum.json"
$.ajax({
    url: datum_json_file,
    dataType: 'json',
    async: false,
    success: function(json_data) {
      $(jQuery.parseJSON(JSON.stringify(json_data)).reverse()).each(function() {
          update_list(this)
      });
    }
}).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
});

var userList = new List('blogroll', options, blogEntries);

/* tooltip to all titles in list */
$('*').filter(function() {
   return $(this).css('text-overflow') == 'ellipsis';
}).each(function() {
   if (this.offsetWidth < this.scrollWidth && !$(this).attr('blogTitle')) {
      $(this).attr('blogTitle', $(this).text());
   }
});
