cd "$env:USERPROFILE/Desktop"

# Установка TS и pm2 глобально
npm install -g typescript pm2 uuid@7

# Установка URL speaker
$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/speaker.zip"

# Пути к временым файлам speaker
$speakerTemp = "$env:TEMP\speaker.zip"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Скачивание speaker з интернета
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp

# Клонирование репозитория проекта
git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

# Переходим в папку проекта
cd "./VoiceAlarmSystem"

# Раззархивация модуля speaker
Expand-Archive -Path $speakerTemp -DestinationPath './node_modules'

# Установка остальных модулей
npm install