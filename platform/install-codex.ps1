<#
.SYNOPSIS
    Installs the Board Agent Toolkit skills for Codex (global).

.DESCRIPTION
    Copies the skills/ bundle from this repository into $HOME\.codex\skills.
    Idempotent: existing skill folders are overwritten with the current copy.
    Pass -Target to install elsewhere (e.g. a project-local path).

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File platform/install-codex.ps1
    powershell -ExecutionPolicy Bypass -File platform/install-codex.ps1 -Target "$HOME\.codex\skills"
#>
[CmdletBinding()]
param(
    [string]$Target = "$HOME\.codex\skills"
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Source   = Join-Path $RepoRoot 'skills'

if (-not (Test-Path $Source)) {
    Write-Error "skills bundle not found at $Source"
    exit 1
}

if (-not (Test-Path $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}

Get-ChildItem -Path $Source -Directory | ForEach-Object {
    $dest = Join-Path $Target $_.Name
    if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
    Copy-Item -Path (Join-Path $_.FullName '*') -Destination $dest -Recurse -Force
    Write-Host "installed $($_.Name) -> $dest"
}

Write-Host "Board Agent Toolkit skills installed for Codex at $Target"
