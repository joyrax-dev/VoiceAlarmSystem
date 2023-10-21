@echo off
@chcp 65001
setlocal

echo "Startup operator"
ping -n 3 127.0.0.1 >nul:

cd "C:\VoiceAlarmSystem"
pm2 start ecosystem.config.js --only operator