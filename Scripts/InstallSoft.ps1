cd "C:/Users/admin/Desktop"

Write-Host "Проверка наличия прав администратора..."
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
	[Security.Principal.WindowsBuiltInRole] "Administrator")) 
{
	Write-Warning "Недостаточно прав для выполнения этого скрипта."
	Start-Process Powershell -ArgumentList "./InstallSoft.ps1" -Verb RunAs
	Break
}
else 
{
	Write-Host "Права администратора есть – продолжить скрипт..." -ForegroundColor Green
}

# Установка URL софта
$nodeUrl    = "https://nodejs.org/dist/v20.0.0/node-v20.0.0-x64.msi"
$gitUrl     = "https://github.com/git-for-windows/git/releases/download/v2.33.0.windows.2/Git-2.33.0.2-64-bit.exe"
$soxUrl     = "https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/dependencies/sox-14.4.1-win32.exe"

# Пути к временым файлам софта
$nodeTemp    = "$env:TEMP\node.msi"
$gitTemp     = "$env:TEMP\git.exe"
$soxTemp     = "$env:TEMP\sox.exe"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Скачивание софта з интернета
Invoke-WebRequest -Uri $nodeUrl    -OutFile $nodeTemp
Invoke-WebRequest -Uri $gitUrl     -OutFile $gitTemp
Invoke-WebRequest -Uri $soxUrl     -OutFile $soxTemp

# Установка node
Start-Process -Wait -FilePath msiexec.exe -ArgumentList "/i `"$nodeTemp`" /qn"

# Установка git
Start-Process -Wait -FilePath $gitTemp -ArgumentList "/SILENT"

# Установка SoX
Start-Process -FilePath $soxTemp -ArgumentList '/S' -Wait

# Добавление SoX в PATH
[Environment]::SetEnvironmentVariable('PATH', [Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + 'C:\Program Files (x86)\sox-14-4-1', 'Machine')

# Установка TS и pm2 глобально
Start-Process Powershell -ArgumentList '-Command "npm install -g typescript pm2 uuid@7"' -Verb RunAs
