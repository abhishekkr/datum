#!/usr/bin/env bash

addBlogToList(){
  _json="$1"
  _blog="$2"

  _blogFilename=$(basename $_blog)
  _fileType=$(echo $_blogFilename | awk -F"." '{print $NF}')
  _blogDate=$(echo $_blogFilename | awk -F"." '{print $1}')
  _blogName=$(echo $_blogFilename | awk -F"." '{print $2}')

  if [[ "$_fileType" == "html" ]]; then
    _blogmeta=$(echo $_blog | sed 's/html$/meta/')
    _blogTags=$(cat $_blogmeta | grep '^meta-tags: ' | sed 's/meta-tags: //')
    if [[ "$_blogTags" == "" ]]; then
      _blogTags="${_blogName}, ${_blogDate}, datum"
    fi
    _blogTitle=$(cat $_blogmeta | grep '^meta-title: ' | sed 's/meta-title: //')
    if [[ "$_blogTitle" == "" ]]; then
      _blogTitle="$_blogName"
    fi
    _blogEntry="  { \"blogTitle\":\"${_blogTitle}\" , \"blogFile\":\"./www-data/blogs/${_blogFilename}\", \"blogTags\":\"${_blogTags}\" },"
    echo "${_blogEntry}" >>  "${_json}"
  fi
}

Create_Datum_JSON(){
  _datum_json=$1
  _datum_blogstore=$2

  echo '[' > "${_datum_json}"
  dir_list_run "${_datum_blogstore}" "addBlogToList ${_datum_json}"

  _blogEntry="  { \"blogTitle\":\"~ back Home\" , \"blogFile\":\"/\", \"blogTags\":\"homepage\" }"
  echo "${_blogEntry}" >> "${_datum_json}"

  echo ']' >> "${_datum_json}"
}
