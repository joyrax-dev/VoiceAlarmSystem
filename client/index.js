const { Command } = require('commander')

new Command('start')
	.description('Client startup')
	.option('--type <value>', 'Client type')
	.action(function(value) {
		const { type } = value
		process.env.type = type

		const socket = require('./socket')()

		const clients = []
		clients['operator'] = require('./operator')
		clients['speaker'] = require('./speaker')

		clients[type](socket)
	})
	.parse(process.argv)