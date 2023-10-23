cd "C:/VoiceAlarmSystem/Source"

$HostName = Read-Host "Host"

$jsonContent = Get-Content -Raw -Path "client.json" | ConvertFrom-Json
$jsonContent.Host = $HostName

$jsonContent | ConvertTo-Json -Depth 4 | Set-Content -Path "client.json"
