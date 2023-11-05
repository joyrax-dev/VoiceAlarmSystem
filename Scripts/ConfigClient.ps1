cd "$env:USERPROFILE/Desktop/VoiceAlarmSystem/Source"

# Записываем ввод пользователя
$HostName = Read-Host "Host"
$Type     = Read-Host "Type"
$Location = Read-Host "Location"

# Читаем конфиг
$jsonContent = Get-Content -Raw -Path "client.json" | ConvertFrom-Json

# Изменяем конфиг
$jsonContent.Host            = $HostName
$jsonContent.Client.Type     = $Type
$jsonContent.Client.Location = $Location

# Записываем конфиг
$jsonContent | ConvertTo-Json -Depth 2 | Set-Content -Path "client.json"
