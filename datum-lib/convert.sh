#!/usr/bin/env bash
##### responsible for MD to HTML creations

####### extracts meta-data from MD files to meta files
Extract_Data_Meta(){
  wrong_params "$#" "2" "SYNTAX: Extract_Data_Meta <SOURCE> <DESTINATION>"
  _datum_src=$1
  _datum_dst=$2

  cat $_datum_src | grep '^```meta\-.*```$' | sed 's/```//g' > $_datum_dst
}

####### extracts blog data from MD file to be converted later
Extract_Data_Body(){
  wrong_params "$#" "2" "SYNTAX: Extract_Data_Body <SOURCE> <DESTINATION>"
  _datum_src=$1
  _datum_dst=$2
  cat $_datum_src | grep -v '^```meta\-.*```$' > $_datum_dst
}

####### enables convert a MD blog data file using GitHub API
Github_MD_To_HTML(){
  wrong_params "$#" "2" "SYNTAX: Github_MD_To_HTML <markdown-filepath> <dest-html-filepath>"
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

  echo "Gitub Converting: ${_markdown_filepath} to ${_html_filepath}"
  cat $_github_json_filepath | curl -sLk -X POST -d@- https://api.github.com/markdown > $_html_filepath
  rm $_github_json_filepath
}

####### enables conversion of MD blog data by default (GitHub API) mode
Default_MD_To_HTML(){
  echo "ERROR: Datum Converter \"$DATUM_CONVERTER\" is not supported. Converting using default datum converter \"Github\", requires internet availability."
  Github_MD_To_HTML $1 $2
}

####### enables conversion of MD blog data by Pandoc (if set DATUM_CONVERTER="pandoc")
Pandoc_MD_To_HTML(){
  wrong_params "$#" "2" "SYNTAX: Pandoc_MD_To_HTML <markdown-filepath> <dest-html-filepath>"
  unset _markdown_filepath
  unset _html_filepath

  _markdown_filepath=$1
  _html_filepath=$2

  if_cmd "pandoc"
      then_run "pandoc -f markdown -t html -o $_html_filepath $_markdown_filepath"
      else_run "Default_MD_To_HTML \"$1\" \"$2\""
  end_if
  echo "Pandoc Converting: ${_markdown_filepath} to ${_html_filepath}"
}

####### base function calling helper MD to HTML converter based on DATUM_CONVERTER
Markdown_To_HTML(){
  wrong_params "$#" "2" "SYNTAX: Markdown_To_HTML <markdown-filepath> <dest-html-filepath>"
  unset _markdown_filepath
  unset _html_filepath

  _markdown_filepath=$1
  _html_filepath=$2

  if_equal "$DATUM_CONVERTER" "pandoc"
      then_run "Pandoc_MD_To_HTML \"$1\" \"$2\""
  else_if_equal "$DATUM_CONVERTER" "github"
      then_run "Github_MD_To_HTML \"$1\" \"$2\""
  else_run "Default_MD_To_HTML \"$1\" \"$2\""
  end_if
}

####### enables Meta, Blog extraction AND conversion handling
Convert_To_W3Data(){
  wrong_params "$#" "3" "Error: Convert_To_W3Data <Destination-Dir> <Datum-Source-File>"
  export DATUM_CONVERTER="$1"
  _datum_dst_dir="$2"
  _datum_src="$3"

  if_not_dir "$_datum_dst_dir"
      then_run "echo \"ERROR: '${DATUM_W3DATA}' path not found.\" ; exit 1"

  _need_conversion=0
  _datum_filename="$(basename "$_datum_src")"
  _w3_filepath="${_datum_dst_dir}/${_datum_filename}"
  _w3_html_filepath="${_w3_filepath}.html"
  _w3_body_filepath="${_w3_filepath}.body"
  _w3_meta_filepath="${_w3_filepath}.meta"
  _w3_md5_filepath="${_w3_filepath}.md5"

  if [[ -f "$_w3_md5_filepath" ]]; then
    local datumMD5=$(md5sum "$_datum_src" | awk '{print $1}')
    local w3DatumMD5=$(cat "$_w3_md5_filepath")
    if [[ "$datumMD5" == "$w3DatumMD5" ]]; then
      _need_conversion=1
    fi
  fi

  if [[ $_need_conversion -eq 0 ]]; then
    md5sum "$_datum_src" | awk '{print $1}' | tee "$_w3_md5_filepath"

    Extract_Data_Meta "$_datum_src" "$_w3_meta_filepath"
    Extract_Data_Body "$_datum_src" "$_w3_body_filepath"
    Markdown_To_HTML "$_w3_body_filepath" "${_w3_html_filepath}"

    rm "$_w3_body_filepath"
  fi
}

####### clean up the BASH env mess
Clean.Convert(){
  unset _datum_src
  unset _datum_dst
  unset _datum_dst_dir

  unset _datum_filename
  unset _w3_filepath
  unset _w3_body_filepath
  unset _w3_meta_filepath
}
