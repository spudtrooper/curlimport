#!/bin/sh

scripts=$(dirname $0)
cli=$(readlink -f $scripts/..)
root=$(readlink -f $cli/..)

yarn --cwd $root
yarn --cwd $root clean

rm -rf $cli/tmp
$scripts/just_test.sh "$@"
