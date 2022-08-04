#!/bin/bash
#
# Maimai-Alias-Querier -> build.sh
# (c) 2022 Lingrottin
# License: MIT License
#
function testPath(){
    if [ -f $1 ]
    then
        echo "[INFO] $1 exists."
    else
        echo "[FATAL] $1 not exists"
        exit 1
    fi
}
function testDir(){
    if [ -d $1 ]
    then
        echo "[INFO] $1 exists."
    else
        echo "[FATAL] $1 not exists"
        exit 1
    fi
}

curPath=$(cd `dirname $0`; pwd)

if [ -d "$curPath/build" ]
then
    mkdir "$curPath/build"
fi

testDir  "$curPath/layouts"
testPath "$curPath/package.json"
testPath "$curPath/config.toml"
testPath "$curPath/data.json"
testPath "$curPath/tsconfig.json"

npm install
npm run build