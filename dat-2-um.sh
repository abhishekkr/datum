#!/usr/bin/env bash
########################## include<>

RAGUEL_SRC="./raguel-master/src/raguel.sh"
if [[ ! -f $RAGUEL_SRC ]]; then
  RAGUEL_URL="https://github.com/abhishekkr/raguel/archive/master.tar.gz"
  RAGUEL_TGZ="raguel.tgz"

  curl -kL -o $RAGUEL_TGZ $RAGUEL_URL
  tar -zxf raguel.tgz
fi
. $RAGUEL_SRC --source-only

############################ key=val

THIS_DIR="$(dirname $0)"
if_not_var $DATUM_BASEDIR
    then_run DATUM_BASEDIR="$THIS_DIR"
end_if

if_not_var $DATUM_DAT_A
    then_if_var $1
        then_run DATUM_DAT_A="$1"
        else_run DATUM_DAT_A="${DATUM_BASEDIR}/dat-a"
end_if

if_not_var $DATUM_W3DATA
    then_if_var $2
        then_run DATUM_W3DATA="$2"
        else_run DATUM_W3DATA="${DATUM_BASEDIR}/www-data"
end_if

########################## func().from

try_source $THIS_DIR/datum-lib/convert.sh

########################## main()

echo "DATUM meta~"
echo "basedir:  "$DATUM_BASEDIR
echo "dat-a:    "$DATUM_DAT_A
echo "www-data: "$DATUM_W3DATA
echo ""

mkdir -p $DATUM_W3DATA
dir_list_run $DATUM_DAT_A "Convert_To_W3Data $DATUM_W3DATA"


Clean.Convert
