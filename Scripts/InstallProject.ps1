cd "C:/"

# Установка URL speaker
$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/speaker.zip"

# Пути к временым файлам speaker
$speakerTemp = "$env:TEMP\speaker.zip"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Скачивание speaker з интернета
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp

# Клонирование репозитория проекта
git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

# Раззархивация модуля speaker
Expand-Archive -Path $speakerTemp -DestinationPath 'C:/VoiceAlarmSystem/node_modules'

cd "C:/VoiceAlarmSystem"

# Установка остальных модулей
npm install