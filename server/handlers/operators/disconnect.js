module.exports = function disconnect (socket, namespace) {
	return (reason) => {
		console.info(`Operator disconnected: ${socket.id}`)
	}
}