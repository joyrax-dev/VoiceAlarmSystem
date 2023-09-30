const { logger, store } = require('../services')
const deauth = require('./deauth')

module.exports = (socket, namespaces) => {
	return function disconnect (reason) {
		const { type, location } = store.get(socket.id)

		logger.info(`Client disconnected [id=${socket.id}] [type=${type}] [location=${location}] [reason=${reason}]`)
		deauth(socket, namespaces)()

		if (reason == 'server namespace disconnect') {
			// Сокет был принудительно отключен с помощью socket.disconnect()
			logger.error(`Сокет был принудительно отключен с помощью socket.disconnect()`)
		}
		else if (reason == 'client namespace disconnect') {
			// Клиент вручную отключил сокет, используя socket.disconnect()
			logger.error(`Клиент вручную отключил сокет, используя socket.disconnect()`)
		}
		else if (reason == 'server shutting down') {
			// Сервер, ну, отключается
			logger.error(`Сервер, ну, отключается`)
		}
		else if (reason == 'ping timeout') {
			// Kлиент не отправил пакет PONG в течение задержки pingTimeout
			logger.error(`Kлиент не отправил пакет PONG в течение задержки pingTimeout`)
		}
		else if (reason == 'transport close') {
			// Соединение было прервано (пример: пользователь потерял соединение или сеть была изменена с WiFi на 4G)
			logger.error(`Соединение было прервано (пример: пользователь потерял соединение или сеть была изменена с WiFi на 4G)`)
		}
		else if (reason == 'transport error') {
			// При подключении произошла ошибка.
			logger.error(`При подключении произошла ошибка.`)
		}
		else if (reason == 'parse error') {
			// Сервер получил недопустимый пакет от клиента
			logger.error(`Сервер получил недопустимый пакет от клиента`)
		}
		else if (reason == 'forced close') {
			// Сервер получил недопустимый пакет от клиента
			logger.error(`Сервер получил недопустимый пакет от клиента`)
		}
		else if (reason == 'forced server close') {
			// Клиент вовремя не присоединился к пространству имен (см. параметр connectTimeout ) и был принудительно закрыт
			logger.error(`Клиент вовремя не присоединился к пространству имен (см. параметр connectTimeout ) и был принудительно закрыт`)
		}
	}
}

