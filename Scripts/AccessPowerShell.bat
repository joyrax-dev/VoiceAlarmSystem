@echo off
@chcp 65001

powershell -Command "Set-ExecutionPolicy RemoteSigned"

REM Create the "runas" subkey
reg add "HKEY_CLASSES_ROOT\Microsoft.PowerShellScript.1\shell\runas" /f

REM Create the "HasLUAShield" string parameter with an empty value
reg add "HKEY_CLASSES_ROOT\Microsoft.PowerShellScript.1\shell\runas" /v "HasLUAShield" /t REG_SZ /d "" /f

REM Create the "command" subkey
reg add "HKEY_CLASSES_ROOT\Microsoft.PowerShellScript.1\shell\runas\command" /f

Set file="%CD%\command.txt"

For /F "usebackq tokens=* delims=" %%i In ("%file%") Do Set var=%%i

REM Set the default value of the registry key
reg add "HKEY_CLASSES_ROOT\Microsoft.PowerShellScript.1\shell\runas\command" /v "(Default)" /t REG_SZ /d %var%
