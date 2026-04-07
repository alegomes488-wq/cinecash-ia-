<#
  Minimal PowerShell deploy script for local use.
  WARNING: Inspect the script before running. Intended for use by maintainers.
#>
param(
  [string]$Branch = 'main'
)

Write-Host "Staging all changes..."
git add -A

$msg = "chore(deploy): deploy from IA Developer Hub - $(Get-Date -Format o)"
git commit -m $msg
git push origin HEAD:$Branch

Write-Host "Done."
