param(
  [string]$SecretsPath = ".secrets.local.json"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Net.Http
$secrets = Get-Content -LiteralPath $SecretsPath -Raw | ConvertFrom-Json
if (-not $secrets.cloudflareApiToken -or -not $secrets.githubClientSecret) {
  throw "Completa cloudflareApiToken y githubClientSecret en $SecretsPath."
}

$headers = @{ Authorization = "Bearer $($secrets.cloudflareApiToken)" }
$accounts = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts" -Headers $headers
if (-not $accounts.success -or $accounts.result.Count -ne 1) {
  throw "El token debe tener acceso a una sola cuenta de Cloudflare para desplegar este Worker."
}

$accountId = $accounts.result[0].id
$metadata = @{
  main_module = "index.js"
  compatibility_date = "2026-08-03"
  bindings = @(
    @{ type = "plain_text"; name = "GITHUB_CLIENT_ID"; text = "Ov23liI3g6T2kLJCpYso" },
    @{ type = "plain_text"; name = "APP_ORIGIN"; text = "https://raul-s-c.github.io" },
    @{ type = "secret_text"; name = "GITHUB_CLIENT_SECRET"; text = $secrets.githubClientSecret }
  )
} | ConvertTo-Json -Depth 8 -Compress

$content = [System.Net.Http.MultipartFormDataContent]::new()
$metadataContent = [System.Net.Http.StringContent]::new($metadata, [System.Text.Encoding]::UTF8, "application/json")
$content.Add($metadataContent, "metadata")
$scriptContent = [System.Net.Http.ByteArrayContent]::new([System.IO.File]::ReadAllBytes((Join-Path $PSScriptRoot "src\index.js")))
$scriptContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/javascript+module")
$content.Add($scriptContent, "index.js", "index.js")

$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Bearer", $secrets.cloudflareApiToken)
$response = $client.PutAsync("https://api.cloudflare.com/client/v4/accounts/$accountId/workers/scripts/nihongo-benkyo-auth", $content).GetAwaiter().GetResult()
$body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult() | ConvertFrom-Json
if (-not $response.IsSuccessStatusCode -or -not $body.success) {
  $messages = @($body.errors | ForEach-Object { $_.message }) -join "; "
  throw "Cloudflare no acepto el despliegue: $messages"
}

$enableSubdomain = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/workers/scripts/nihongo-benkyo-auth/subdomain" -Method Post -Headers $headers -ContentType "application/json" -Body '{"enabled":true}'
if (-not $enableSubdomain.success -or -not $enableSubdomain.result.enabled) {
  throw "Cloudflare no pudo habilitar workers.dev para este Worker."
}

$subdomain = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/workers/subdomain" -Headers $headers
if (-not $subdomain.success -or -not $subdomain.result.subdomain) {
  throw "El Worker esta desplegado, pero falta activar workers.dev en tu cuenta de Cloudflare."
}

Write-Output "https://nihongo-benkyo-auth.$($subdomain.result.subdomain).workers.dev"
