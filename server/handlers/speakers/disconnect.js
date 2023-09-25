module.exports = function disconnect (socket, namespace) {
	return (reason) => {
		console.info(`Speaker disconnected: ${socket.id}`)
	}
}