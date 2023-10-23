cd "C:/"

# Установка URL speaker
$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/raw/main/Soft/speaker.zip"

# Пути к временым файлам speaker
$speakerTemp = "$env:TEMP\speaker.zip"

# Скачивание speaker з интернета
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp

# Установка TS и pm2 глобально
npm install -g typescript pm2

# Клонирование репозитория проекта
git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

# Раззархивация модуля speaker
Expand-Archive -Path $speakerTemp -DestinationPath 'C:/VoiceAlarmSystem/node_modules'

# Установка остальных модулей
npm install