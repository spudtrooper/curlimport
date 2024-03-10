#!/bin/sh

scripts=$(dirname $0)
root=$(dirname $scripts)

yarn global remove curlimport || true

pushd $root >/dev/null
yarn build
yarn global add file:$PWD
popd >/dev/null
