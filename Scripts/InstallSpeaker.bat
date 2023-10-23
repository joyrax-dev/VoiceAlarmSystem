@echo off
@chcp 65001
setlocal

echo "Installing Speaker"
ping -n 3 127.0.0.1 >nul:

:: распаковка модуля спикера
powershell -Command "Expand-Archive -Path 'C:/VoiceAlarmSystem/Soft/speaker.zip' -DestinationPath 'C:/VoiceAlarmSystem/node_modules'"
