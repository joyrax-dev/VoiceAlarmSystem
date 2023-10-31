const { spawn, exec } = require('child_process')
const { access, constants, rmdirSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const appUrl = `https://github.com/joyrax-dev/VoiceAlarmSystem/releases/download/test_installer/VoiceAlarmSystem.zip`

const apploc = `C:/Users/specialist/Desktop`
const appPath = join(apploc, `VoiceAlarmSystem`)

const powershellUnarchive = `
	$speakerTemp = "$env:TEMP\\VoiceAlarmSystem.zip"
	[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
	Invoke-WebRequest -Uri "${appUrl}" -OutFile $speakerTemp
	Expand-Archive -Path $speakerTemp -DestinationPath "${appPath}"
`

access(appPath, constants.F_OK, (err) => {
	if (err) { // чистая установка приложения
		console.error(`Папка "${appPath}" не существует`)
		Install()
	}
	else { // Обновление уже установленого приложения
		// загрузка старых конфигов
		const clientCfg = readFileSync(join(appPath, 'Build/client.json'), { encoding: 'utf8' })
		const serverCfg = readFileSync(join(appPath, 'Build/server.json'), { encoding: 'utf8' })
		const shortcutCfg = readFileSync(join(appPath, 'Build/shortcuts.json'), { encoding: 'utf8' })


		try {
			rmdirSync(appPath, { recursive: true })

			console.log(`Папка "${appPath}" успешно удалена`)

			Install(() => {
				// запись конфигов
				writeFileSync(join(appPath, 'Build/client.json'), clientCfg, { encoding: 'utf8' })
				writeFileSync(join(appPath, 'Build/server.json'), serverCfg, { encoding: 'utf8' })
				writeFileSync(join(appPath, 'Build/shortcuts.json'), shortcutCfg, { encoding: 'utf8' })
			})
		}
		catch {
			console.error(`Ошибка при удалении папки "${appPath}": ${error.message}`)
		}
	}
})

function Install(ended_callback = () => {}) {
	// запуск скрипта загрузки и распаковки
	const powershellProcess = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-NoLogo', '-ExecutionPolicy', 'Bypass', '-Command', powershellUnarchive])

	powershellProcess.stdout.on('data', (data) => {
		console.log(`Вывод скрипта PowerShell: ${data}`)
	})
	  
	powershellProcess.stderr.on('data', (data) => {
		console.error(`Ошибка при выполнении скрипта PowerShell: ${data}`)
	})

	powershellProcess.on('close', (code) => {

		// Установка зависимостей
		exec(`cd ${appPath} && npm install pm2 && npm install`, (error, stdout, stderr) => {
			console.log(`Вывод команды npm: ${stdout}`);
			ended_callback()
		})
	})
}