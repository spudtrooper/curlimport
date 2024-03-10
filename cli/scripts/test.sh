#!/bin/sh

scripts=$(dirname $0)
cli=$(dirname $scripts)

mkdir -p tmp

test_one() {
  local base=$1

  local input=../data/input/$base.sh
  local output=tmp/$base.js

  echo "Testing $base..."

  pushd $cli >/dev/null
  ./src/index.js -f $input --output_json >$output
  node $output
  popd >/dev/null
}

test_one GetSeatmap
test_one GetSeatmapBackgroundPaths
