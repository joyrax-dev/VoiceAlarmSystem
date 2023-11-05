cd "$env:USERPROFILE/Desktop/VoiceAlarmSystem/Source"

# Записываем ввод пользователя
$HostName = Read-Host "Host"

# Читаем конфиг
$jsonContent = Get-Content -Raw -Path "server.json" | ConvertFrom-Json

# Изменяем конфиг
$jsonContent.Host = $HostName

# Записываем конфиг
$jsonContent | ConvertTo-Json -Depth 2 | Set-Content -Path "server.json"
