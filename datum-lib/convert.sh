#!/usr/bin/env bash

Extract_Data_Meta(){
  wrong_params "$#" "2" "SYNTAX: Extract_Data_Meta <SOURCE> <DESTINATION>"
  _datum_src=$1
  _datum_dst=$2

  cat $_datum_src | grep '^```meta\-.*```$' | sed 's/```//g' > $_datum_dst
}

Extract_Data_Body(){
  wrong_params "$#" "2" "SYNTAX: Extract_Data_Body <SOURCE> <DESTINATION>"
  _datum_src=$1
  _datum_dst=$2
  cat $_datum_src | grep -v '^```meta\-.*```$' > $_datum_dst
}

Markdown_To_HTML(){
  wrong_params "$#" "2" "SYNTAX: Markdown_To_HTML <markdown-filepath> <dest-html-filepath>"
  unset _markdown_filepath
  unset _html_filepath
  unset _github_json_filepath
  unset _markdown_for_github

  _markdown_filepath=$1
  _html_filepath=$2

  _github_json_filepath="${_markdown_filepath}.json"

  sed -i 's/$/\\n/g' $_markdown_filepath
  sed -i 's/"/\\"/g' $_markdown_filepath

  echo "{ \"text\" : \"" > $_github_json_filepath
  cat $_markdown_filepath >> $_github_json_filepath
  echo "\" }" >> $_github_json_filepath

  cat $_github_json_filepath | curl -sLk -X POST -d@- https://api.github.com/markdown > $_html_filepath
  rm $_github_json_filepath
}

Convert_To_W3Data(){
  wrong_params "$#" "2" "Error: Convert_To_W3Data <Destination-Dir> <Datum-Source-File>"
  _datum_dst_dir=$1
  _datum_src=$2

  if_not_dir $_datum_dst_dir
      then_run "echo \"ERROR: '${DATUM_W3DATA}' path not found.\" ; exit 1"

  _datum_filename="$(basename $_datum_src)"
  _w3_filepath="${_datum_dst_dir}/${_datum_filename}"
  _w3_html_filepath="${_w3_filepath}.html"
  _w3_body_filepath="${_w3_filepath}.body"
  _w3_meta_filepath="${_w3_filepath}.meta"
  echo "Converting: "$_datum_filename

  Extract_Data_Meta $_datum_src $_w3_meta_filepath
  Extract_Data_Body $_datum_src $_w3_body_filepath
  Markdown_To_HTML $_w3_body_filepath "${_w3_html_filepath}"

  rm $_w3_body_filepath
}

Clean.Convert(){
  unset _datum_src
  unset _datum_dst
  unset _datum_dst_dir

  unset _datum_filename
  unset _w3_filepath
  unset _w3_body_filepath
  unset _w3_meta_filepath
}
