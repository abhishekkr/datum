/*
author: AbhishekKr
am an occasional javascript artisen, comments/suggestions encouraged
*/

/* globals */

const blogListHash = "";

const $DOM = function(a,b){var c=document.querySelectorAll(a);if(b===undefined){b=0}return c[b]}

const BLOG_DOMAIN = window.location.origin;
const CURRENT_URL = window.location.href;
const wwwDataParentUrl = CURRENT_URL.split('#')[0];

var BLOG_MENU = document.getElementById("blogmenu");

const datumJsonFile =  "./datum.json";


/* helper functions */

const blogTokenFromHash = function(){
  return document.location.hash.replace(/^#/, '');
}


const toggleBlogContentToList = function(){
  document.location.hash = blogListHash;
  $DOM("#blogcontent").style.display = "none";
  $DOM("#bloglist").style.display = "block";
  BLOG_MENU.style.display = "none";
}


function blogHashFromLink(blog_link){
  return blog_link.replace(BLOG_DOMAIN, '');
}


function blogLinkFromHash(blog_hash){
  return BLOG_DOMAIN + blog_hash;
}


const markdownToHTML = function(mduri) {
  var ihtml = undefined;
  fetch(mduri)
    .then((response) => response.text())
    .then((data) => {
      var converter = new showdown.converter({
          emoji: true,
          underline: true,
        });
      return converter.makehtml(data);
    });
}

const urlBody = function(uri, isMD=false){
  var iHTML = undefined;
  var x = new XMLHttpRequest();
  x.open("GET", uri, false);
  x.send();
  x.onerror = function(){
    console.log("failed to get ", uri);
  }
  var data = x.responseText
  if (isMD) {
    var converter = new showdown.Converter({
        emoji: true,
        underline: true,
      });
    iHTML = converter.makeHtml(data);
  } else {
    iHTML = data;
  }
  return iHTML;
}


function toggleBlogListToContent(blogURL){
  var blog_link = window.location.href.split('#')[0] + "#" + encodeURIComponent(blogURL);
  document.location.hash = blogHashFromLink(blogURL);

  const isMD = (blogURL.split('.').pop().trim() == "md")
  var blogContent = urlBody(blogURL, isMD);
  if (undefined == blogContent){
    blogContent = "<div class=\"wip\"><p>HTTP 404</p>The page you are looking for is not found.</div>";
  } else {
    console.log("ERROR: Cannot browse link for this blog.");
  }
  $DOM("#blogcontent").innerHTML = blogContent;
  $DOM("#blogcontent").style.display = "block";
  $DOM("#bloglist").style.display = "none";
  BLOG_MENU.style.display = "block";
  styleCodeBlocks();
}


function openBlog(self) {
  var blogFileObject = self.parentNode.getElementsByClassName("blogFile");
  if(blogFileObject.length == 1){
    toggleBlogListToContent(blogFileObject[0].innerHTML);
  } else {
    console.log("ERROR: No link found for this.");
  }
}

/* add all elements from loaded list */
function updateList(item){
  if ('content' in document.createElement('template') == false) {
    console.log("ERROR: Failed appending to bloglist: ", item);
    return
  }
  item.blogFile = item.blogFile.replace(/^.\//, '/')
  const blogURL =  wwwDataParentUrl + '#' + item.blogFile;

  var template = document.getElementById('bloglistTmpl');
  var blogUL = document.getElementById("bloglist");

  var clone = template.content.cloneNode(true);
  clone.querySelector(".blogTitle").textContent = item.blogTitle;
  clone.querySelector(".blogFile").textContent = item.blogFile;
  clone.querySelector(".blogURL").textContent = blogURL;
  clone.querySelector(".blogTags").textContent = item.blogTags;
  blogUL.appendChild(clone);
  //console.log(blogURL);
}


const loadDatumJSON = function(jsonfile) {
  fetch(jsonfile)
    .then((response) => response.text())
    .then((data) => {
        var bloglist = $.parseJSON(data);
        //console.log(bloglist);
        bloglist.forEach(function(b) {
            updateList(b);
        });
    });
}


/************   __main__     **********/
loadDatumJSON(datumJsonFile);

/* tooltip to all titles in list */
/*
$('*').filter(function() {
   return $(this).css('text-overflow') == 'ellipsis';
}).each(function() {
   if (this.offsetWidth < this.scrollWidth && !$(this).attr('blogTitle')) {
      $(this).attr('blogTitle', $(this).text());
   }
});
*/

/* capture hash link with blog-url to render required blog */
var blog_hash = blogTokenFromHash();
if (blog_hash != "" && blog_hash != blogListHash) {
  var blog_url = decodeURIComponent(blogLinkFromHash(blog_hash));
  console.log("Direct Blog Link:", blog_url, blog_hash);
  toggleBlogListToContent(blog_url);
}

/* adjust list/content on page after a hash change */
window.addEventListener('hashchange', function() {
    var blogHash = blogTokenFromHash();
    if (blogHash.length > 0){
      toggleBlogListToContent(blogHash);
    } else {
      toggleBlogContentToList();
    }
}, false);
