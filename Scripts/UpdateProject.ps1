# заходим в папку скомпилированого проекта
cd "$env:USERPROFILE/Desktop/VoiceAlarmSystem/Build"

# копируем конфиги в память
$clientConfig = Get-Content -Raw -Path "client.json" | ConvertFrom-Json
$serverConfig = Get-Content -Raw -Path "server.json" | ConvertFrom-Json

# выходим из папки проекта
cd "../.."

# удаляем старую папку проекта
Remove-Item -Path "VoiceAlarmSystem" -Recurse -Force

# клонируем новую версию проекта
git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

# переходим в папку проекта
cd "./VoiceAlarmSystem"

# скачиваем и устанавливаем модуль speaker
$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/speaker.zip"
$speakerTemp = "$env:TEMP\speaker.zip"
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp
Expand-Archive -Path $speakerTemp -DestinationPath 'node_modules'

# устанавливаем остальные зависимости
npm install

# запускаем сборку проекта
npm run build

# переходим в папку скомпилированого проекта
cd "./Build"

# восстанавливаем конфиги
$clientConfig | ConvertTo-Json -Depth 2 | Set-Content -Path "client.json"
$serverConfig | ConvertTo-Json -Depth 2 | Set-Content -Path "server.json"