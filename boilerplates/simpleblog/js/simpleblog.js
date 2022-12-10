/* manages markdown render to html */

const renderMarkdown = function(mduri) {
  var blogcontent = document.getElementById('blogcontent');
  var ihtml = undefined;

  fetch(mduri)
    .then((response) => response.text())
    .then((data) => {
      var converter = new showdown.Converter({
          emoji: true,
          underline: true,
        });
      blogcontent.innerHTML = converter.makeHtml(data);
    });
}
