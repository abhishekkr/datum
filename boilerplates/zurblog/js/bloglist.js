/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/

function openNew(self){
  window.open(self.innerHTML);
  return false;
}

var options = {
  valueNames: [ 'blogTitle', 'blogFile', 'blogTags', 'blogDate' ],
  item: '<li><article> <a class="blogTitleLink" src="#"><h3 class="blogTitle"></h3></a> <div class="blogDate"></div> <a class="blogFile" href="javascript:void(0)" onclick="openNew(this);" onkeypress="openNew(this);"></a> <p class="blogTags"></p> </article> <hr/></li>',
  page: 10,
  plugins: [ ListPagination({}), ListFuzzySearch() ]
};

var values = [];
var userList = new List('blogroll', options, values);

/* add all elements from loaded list */
function update_list(this_item){
  userList.add({
    blogTitle: this_item.blogTitle,
    blogFile: this_item.blogFile,
    blogTags: this_item.blogTags
  });
}

datum_json =  "./www-data/datum.json"
$.getJSON( datum_json, {}) .done(function( json ) {
      $(jQuery.parseJSON(JSON.stringify(json)).reverse()).each(function() {  
          update_list(this)
      });
  })
  .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
});


/* tooltip to all titles in list */
$('*').filter(function() {
   return $(this).css('text-overflow') == 'ellipsis';
}).each(function() {
   if (this.offsetWidth < this.scrollWidth && !$(this).attr('blogTitle')) {
      $(this).attr('blogTitle', $(this).text());
   }
});
