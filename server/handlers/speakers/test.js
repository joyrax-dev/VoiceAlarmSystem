module.exports = (socket, namespace) => {
	return function testtest (data) {
		console.info(`Operator: ${socket.id} sended data: ${data}`)
	}
}