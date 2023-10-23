@echo off
@chcp 65001
setlocal

cd "C:\VoiceAlarmSystem\Build"
set Config="client.json"

:: set /p Host=Host: 
:: powershell -Command "(Get-Content %Config% -Raw) -replace '\"Host\": \".*\"', '\"Host\": \"%Host%\"' | Set-Content %Config%""

set /p Location=Location: 
powershell -Command "(Get-Content %Config% -Raw) -replace '\"Location\": \".*\"', '\"Location\": \"%Location%\"' | Set-Content %Config%"

set /p Type=Type: 
powershell -Command "(Get-Content %Config% -Raw) -replace '\"Type\": \".*\"', '\"Type\": \"%Type%\"' | Set-Content %Config%"