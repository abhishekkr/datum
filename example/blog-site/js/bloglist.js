/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/


/**************** listifying **********************/

function openNew(self){
  window.open(self.innerHTML);
  return false;
}

var currentURL = window.location.href;
var wwwDataParentURL = currentURL.replace(currentURL.split("/").pop(), "");

var blogEntries = [];
var fuzzyOptions = { searchClass: "fuzzy-search", location: 0, distance: 100, threshold: 0.4, multiSearch: true };
var options = {
  valueNames: [ 'blogTitle', 'blogFile', 'blogTags', 'blogDate' ],
  item: '<li><article> <a class="blogTitleLink" src="#"><h3 class="blogTitle"></h3></a> <div class="blogDate"></div> <a class="blogFile" href="javascript:void(0)" onclick="openNew(this);" onkeypress="openNew(this);"></a> <h5><small class="blogTags"></small><h5> </article></li>',
  page: 5,
  plugins: [ ListPagination({}), ListFuzzySearch() ]
};


/* add all elements from loaded list */
function update_list(this_item){
  var blogURL =  wwwDataParentURL + this_item.blogFile;
  blogURL = blogURL.replace("/./", "/");
  blogEntries.push({
    blogTitle: this_item.blogTitle,
    blogFile: blogURL,
    blogTags: this_item.blogTags
  });
}

var datum_json_file =  "./datum.json"
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
