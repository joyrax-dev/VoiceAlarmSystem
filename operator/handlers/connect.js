const { hostname, port } = require('../config.json')

module.exports = (socket) => {
	return function connect () {
		console.log(`Connected to: http://${hostname}:${port}`)
	}
}