@echo off
@chcp 65001
setlocal

echo "Startup client"
ping -n 3 127.0.0.1 >nul:

cd "C:\VoiceAlarmSystem"
pm2 start ecosystem.config.js --only client