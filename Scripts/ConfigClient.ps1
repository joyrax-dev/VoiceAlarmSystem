cd "C:/VoiceAlarmSystem/Source"

$HostName = Read-Host "Host"
$Type = Read-Host "Type"
$Location = Read-Host "Location"

$jsonContent = Get-Content -Raw -Path "client.json" | ConvertFrom-Json
$jsonContent.Host = $HostName
$jsonContent.Client.Type = $Type
$jsonContent.Client.Location = $Location

$jsonContent | ConvertTo-Json -Depth 4 | Set-Content -Path "client.json"
