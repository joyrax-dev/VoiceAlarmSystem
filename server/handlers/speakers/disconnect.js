module.exports = (socket, namespace) => {
	return function disconnect (reason) {
		console.info(`Speaker disconnected: ${socket.id}`)
	}
}