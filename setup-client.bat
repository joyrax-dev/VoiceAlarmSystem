@echo off
@chcp 65001
setlocal

cd "C:\public\Projects\VoiceAlarmSystem\client"

set /p hostname=hostname: 
powershell -Command "(Get-Content config.json -Raw) -replace '\"hostname\": \".*\"', '\"hostname\": \"%hostname%\"' | Set-Content config.json"

set /p location=location: 
powershell -Command "(Get-Content config.json -Raw) -replace '\"location\": \".*\"', '\"location\": \"%location%\"' | Set-Content config.json"