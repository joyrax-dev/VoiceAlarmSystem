@echo off
@chcp 65001
setlocal

echo "Installing SoX"
ping -n 3 127.0.0.1 >nul:

:: установка сокса
powershell -Command "Start-Process -FilePath 'C:/VoiceAlarmSystem/Soft/sox-14.4.1-win32.exe' -ArgumentList '/S' -Wait"

:: добавление пути сокса в PATH
powershell -Command "[Environment]::SetEnvironmentVariable('PATH', [Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + 'C:\Program Files (x86)\sox-14.4.1', 'Machine')"
