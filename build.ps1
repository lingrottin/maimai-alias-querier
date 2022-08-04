#!/usr/bin/env pwsh
<#
 # Maimai-Alias-Querier -> build.ts1
 # (c) 2022 Lingrottin
 # License: MIT License
 #>

$curDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Test-FileExist{
    param(
        [string]$Path
    )
    $success=(Test-Path -Path $Path);
    if($success){
        Write-Output("[INFO] $Path exists");
    }else{
        Write-OutPut("[FATAL] $Path not exist")
    }
    return $success
}

if(-not (Test-Path -Path "$curDir/build")){
    mkdir -Path "$curDir/build"
}
if( -not (
    (Test-FileExist -Path "$curDir/layouts") -and
    (Test-FileExist -Path "$curDir/package.json") -and
    (Test-FileExist -Path "$curDir/config.toml") -and
    (Test-FileExist -Path "$curDir/data.json") -and
    (Test-FileExist -Path "$curDir/tsconfig.json")
)){
    exit(1);
}

npm install
npm run build

Copy-Item -Path "$curDir/config.toml","$curDir/data.json","$curDir/layouts" -Destination "$curDir/build/" -Recurse
