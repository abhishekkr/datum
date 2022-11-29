var blogcontent = document.getElementById('blogcontent');
var ihtml = undefined;

fetch('/blogs/2014-11-29.ReadMe.md')
.then((response) => response.text())
.then((data) => {
    //console.log(data);
  var converter = new showdown.Converter({
        emoji: true,
        underline: true,
      });
  blogcontent.innerHTML = converter.makeHtml(data);
}
);
