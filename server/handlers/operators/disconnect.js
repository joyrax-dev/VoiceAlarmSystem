module.exports = (socket, namespace) => {
	return function disconnect (reason) {
		console.info(`Operator disconnected: ${socket.id}`)
	}
}