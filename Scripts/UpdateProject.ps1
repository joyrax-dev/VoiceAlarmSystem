cd "C:\VoiceAlarmSystem\Build"

$clientConfig = Get-Content -Raw -Path "client.json" | ConvertFrom-Json
$serverConfig = Get-Content -Raw -Path "server.json" | ConvertFrom-Json

cd "C:\"
Remove-Item -Path "VoiceAlarmSystem" -Recurse -Force

git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

cd "C:\VoiceAlarmSystem"

$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/speaker.zip"
$speakerTemp = "$env:TEMP\speaker.zip"
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp
Expand-Archive -Path $speakerTemp -DestinationPath 'node_modules'

npm install

npm run build

cd "C:\VoiceAlarmSystem\Build"

$clientConfig | ConvertTo-Json -Depth 2 | Set-Content -Path "client.json"
$serverConfig | ConvertTo-Json -Depth 2 | Set-Content -Path "server.json"