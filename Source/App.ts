import { Command } from "commander"

new Command('start')
	.description('Voice Alarm System')
	.option('--which <value>', 'Which application [server, client, monitor]')
	.action(function(value) {
		if (value.which == 'server') {
            import('./Server/Server').then((module) => {
                module.default()
            })
        }
        else if (value.which == 'client') {
            import('./Client/Client').then((module) => {
                module.default()
            })
        }
        else if (value.which == 'monitor') {
            import('./Monitor/Monitor').then((module) => {
                module.default()
            })
        }
        else {
            throw new Error('There is no such app')
        }
	})
	.parse(process.argv)