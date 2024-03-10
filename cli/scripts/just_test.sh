#!/bin/sh

scripts=$(dirname $0)
cli=$(dirname $scripts)
root=$(readlink -f $cli/..)

tmp=$cli/tmp
mkdir -p "$tmp"

yarn --cwd $root
yarn --cwd $root build

test_one() {
  local base=$1

  local input=$root/data/input/$base.sh
  local outdir=$tmp/$base
  mkdir -p $outdir

  echo "Testing $base...see output in $outdir"

  local file_output_f=$outdir/f.js
  local node_output_f=$outdir/f.json
  $cli/src/index.js -f $input --output_json >$file_output_f
  node $file_output_f | jq 'del(.timestamp)' >$node_output_f

  local file_output_s=$outdir/s.js
  local node_output_s=$outdir/s.json
  $cli/src/index.js -s "$(cat $input)" --output_json >$file_output_s
  node $file_output_s | jq 'del(.timestamp)' >$node_output_s

  diff $file_output_f $file_output_s || "FAIL file diff"
  diff $node_output_f $node_output_s || "FAIL node diff"
}

test_one GetSeatmap
test_one GetSeatmapBackgroundPaths
