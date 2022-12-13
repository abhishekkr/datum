/* manages blog specific tweaks */

const styleCodeBlocks = function() {
  var blogContentNode = window.document.getElementById('blogcontent');
  blogContentNode.querySelectorAll('code').forEach(
    function(codeBlock) {
      if (/\r|\n/.exec(codeBlock.innerText)) {
        codeBlock.classList.add("multiline-code");
      } else {
        codeBlock.classList.add("oneline-code");
      }
    }
  );
}

styleCodeBlocks();
