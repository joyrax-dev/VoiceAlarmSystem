
$compress = @{
	LiteralPath= "C:\VoiceAlarmSystem\node_modules", "C:\VoiceAlarmSystem\Build", "C:\VoiceAlarmSystem\package.json", "C:\VoiceAlarmSystem\ecosystem.config.js"
	DestinationPath = "C:\VoiceAlarmSystem\Package.zip"
}
Compress-Archive @compress