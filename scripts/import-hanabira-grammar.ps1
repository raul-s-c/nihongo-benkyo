param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryPath
)

$ErrorActionPreference = "Stop"
$levels = "N5", "N4", "N3", "N2"
foreach ($level in $levels) {
  $source = "HEAD:grammar_json/grammar_ja_${level}_full_alphabetical_0001.json"
  $destination = Join-Path $PSScriptRoot "..\\data\\jlpt-grammar-$($level.ToLower()).json"
  & git --git-dir=$RepositoryPath show $source | Set-Content -LiteralPath $destination -Encoding utf8
}
