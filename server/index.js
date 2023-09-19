const { getRecorder } = require('./recorder')
const { createServer } = require("http")
const { Server } = require("socket.io")
const { hostname, port } = require('./config.json')

const mic = getRecorder()
const httpServer = createServer()
const io = new Server(httpServer)
const userClients = []
const audioClients = []

io.on("connection", (socket) => {
	console.info(`Client connected: ${socket.id}`)
	// TODO: add check client type (user or audio)

	socket.on("disconnect", (reason) => {
		console.info(`Client disconnected: ${socket.id}`)

		logoutClient(socket.id)
	})

	mic.stream().on('data', chunk => {
		ws.send(chunk, {binary: true})
		socket
	})

	socket.on('registration', (data) => { // data [object] (clientType, clientLocation)
		let client = {}

		client.id = socket.id
		client.location = data.clientLocation
		client.type = data.clientType

		if (client.type == 'audio') {
			audioClients.push(client)
		}
		else if (client.type == 'user') {
			userClients.push(client)
		}
	})
})

const logoutClient = (_id) => {
	let found = false


	audioClients.forEach(client => {
		if (found) { return }
		let { id } = client

		if (_id == id) {
			found = true

			audioClients.filter((_client) => _client !== client)
			console.warn(`logout client\n--id: ${client.id}\n--type: ${client.type}\n--location: ${client.location}`)
		}
	})

	userClients.forEach(client => {
		if (found) { return }
		let { id } = client

		if (_id == id) {
			found = true

			userClients.filter((_client) => _client !== client)
			console.warn(`logout client\n--id: ${client.id}\n--type: ${client.type}\n--location: ${client.location}`)
		}
	})
}

httpsServer.listen(port, hostname, () => {
	console.info(`Server is running\nServer hostname: ${host}\nServer port${port}`)
})
// const wss = new WebSocket.Server({port: 9099})

// wss.on('connection', (ws) => {
// 	console.log('Новое подключение')

// 	mic.stream().on('data', chunk => {
// 		ws.send(chunk, {binary: true})
// 	})
// })

// wss.on('close', () => {
// 	console.log('Соединение WebSocket закрыто');
// 	mic.stop();
// });