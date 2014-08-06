#!/usr/bin/env bash

Extract_Data_Meta(){
  wrong_params "$#" "2" "SYNTAX: Extract_Data_Body <SOURCE> <DESTINATION>"
  _datum_src=$1
  _datum_dst=$2

  cat $_datum_src | grep '^```meta\-.*```$' | tee $_datum_dst
}

Extract_Data_Body(){
  echo "body: "$@
  if_not_equal "$#" "2"
      then_run "echo \"Error: Extract_Data_Body needs 2 (SRC, DST) params.\" ; exit 1"
  _datum_src=$1
  _datum_dst=$2

  cat $_datum_src | grep -v '^```meta\-.*```$' | tee $_datum_dst
}

Convert_To_W3Data(){
  if_not_equal "$#" "2"
      then_run "echo \"Error: Convert_To_W3Data needs 1 (source) param.\" ; exit 1"
  _datum_dst_dir=$1
  _datum_src=$2

  if_not_dir $_datum_dst_dir
      then_run "echo \"ERROR: '${DATUM_W3DATA}' path not found.\" ; exit 1"

  _datum_filename="$(basename $_datum_src)"
  _w3_filepath="${_datum_dst_dir}/${_datum_filename}"
  _w3_body_filepath="${_w3_filepath}.body"
  _w3_meta_filepath="${_w3_filepath}.meta"
  echo "Converting: "$_datum_filename

  Extract_Data_Meta $_datum_src $_w3_meta_filepath
  Extract_Data_Body $_datum_src $_w3_body_filepath
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
