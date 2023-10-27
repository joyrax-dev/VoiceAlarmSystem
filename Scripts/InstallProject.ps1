cd "C:/Users/admin/Desktop"

Write-Host "Проверка наличия прав администратора..."
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Недостаточно прав для выполнения этого скрипта."
    Start-Process Powershell -ArgumentList "./InstallProject.ps1" -Verb RunAs
    Break
} else {
    Write-Host "Права администратора есть – продолжить скрипт..." -ForegroundColor Green
}

# Установка URL speaker
$speakerUrl = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/speaker.zip"

# Пути к временым файлам speaker
$speakerTemp = "$env:TEMP\speaker.zip"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Скачивание speaker з интернета
Invoke-WebRequest -Uri $speakerUrl -OutFile $speakerTemp

# Клонирование репозитория проекта
git clone "https://github.com/joyrax-dev/VoiceAlarmSystem.git"

cd "C:/Users/admin/Desktop/VoiceAlarmSystem"
# Раззархивация модуля speaker
Expand-Archive -Path $speakerTemp -DestinationPath './node_modules'

# Установка остальных модулей
npm install