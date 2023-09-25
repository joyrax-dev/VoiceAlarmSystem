module.exports = function testtest (socket, namespace) {
	return (data) => {
		console.info(`Operator: ${socket.id} sended data: ${data}`)
	}
}