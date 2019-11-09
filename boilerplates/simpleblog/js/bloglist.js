/*
author: AbhishekKr
occasional javascript artisen, comments/suggestions encouraged
*/

function toggleBlogContentToList(){
    document.location.hash = "homepage";
    $DOM("#blogcontent").style.display = "none";
    $DOM("#bloglist").style.display = "block";
}

function blogHashFromLink(blog_link){
  return blog_link.replace(blog_domain, '')
}

function blogLinkFromHash(blog_hash){
  return blog_domain + blog_hash
}

function toggleBlogListToContent(blog_url){
    var blog_link = window.location.href.split('?')[0] + "?blog=" + encodeURIComponent(blog_url);

    var backToMenu = "<div width=\"50%\" style=\"text-align:right;\"><i>";
    document.location.hash = blogHashFromLink(blog_url);
    backToMenu += "<span><a href=\"#\" class=\"button radius small\" onClick=\"toggleBlogContentToList();\" onkeypress=\"toggleBlogContentToList();\">back to blog-list</a><span>";
    backToMenu += "</i></div>";

    var blogContent = loadURI(blog_url);
    if (undefined != blogContent){
      blogContent = blogContent + backToMenu;
      $DOM("#blogcontent").innerHTML = blogContent;
      $DOM("#blogcontent").style.display = "block";
      $DOM("#bloglist").style.display = "none";
    } else {
      console.log("ERROR: Cannot browse link for this blog.");
    }
}

function openBlog(self) {
  var blogFileObject = self.parentNode.getElementsByClassName("blogFile");
  if(blogFileObject.length == 1){
    toggleBlogListToContent(blogFileObject[0].innerHTML)
  } else {
    console.log("ERROR: No link found for this.");
  }
}


/**************** listifying **********************/

var blog_domain = window.location.origin;
var currentURL = window.location.href;
var wwwDataParentURL = currentURL.replace(currentURL.split("/").pop(), "");

var blogEntries = [];
var fuzzyOptions = { searchClass: "fuzzy-search", location: 0, distance: 100, threshold: 0.4, multiSearch: true };
var options = {
  valueNames: [ 'blogTitle', 'blogFile', 'blogTags', 'blogDate' ],
  item: '<li><article><h3><a class="blogTitle" href="javascript:void(0)" onClick="openBlog(this);" onkeypress="openBlog(this);"></a> <span class="blogFile"></span></h3> <div class="blogDate"></div> <h4><small class="blogTags"></small></h4> </article></li>',
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

/****************/
var blog_hash = document.location.hash.replace(/^#/, '');
if (blog_hash != "" && blog_hash != "homepage") {
  var blog_url = decodeURIComponent(blogLinkFromHash(blog_hash));
  console.log("Direct Blog Link:", blog_url,blog_hash);
  toggleBlogListToContent(blog_url);
}
