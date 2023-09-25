module.exports = (socket) => {
	return function disconnect (reason) {
		console.log("Client disconnected")

		if (reason === 'io server disconnect') {
			console.log("Server disconnected the client, trying to reconnect")
			socket.connect()
		}
		else {
			console.log("Trying to reconnect again with server")
		}
	}
}