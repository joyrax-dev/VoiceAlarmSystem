cd "C:/VoiceAlarmSystem/Source"

$HostName = Read-Host "Host"

$jsonContent = Get-Content -Raw -Path "server.json" | ConvertFrom-Json
$jsonContent.Host = $HostName

$jsonContent | ConvertTo-Json -Depth 2 | Set-Content -Path "server.json"
