@echo off
@chcp 65001
setlocal

cd "C:\public\Projects\VoiceAlarmSystem\server"

set /p hostname=hostname: 
powershell -Command "(Get-Content config.json -Raw) -replace '\"hostname\": \".*\"', '\"hostname\": \"%hostname%\"' | Set-Content config.json"