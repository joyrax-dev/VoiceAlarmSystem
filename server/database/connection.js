const Sequelize = require('sequelize')
const { logger } = require('../services/logger')
const { user, pass, host, port, dbname } = require('../config.json').database

function getConnectionString() {
	return `postgres://${user}:${pass}@${host}:${port}/${dbname}`
}

function sequelizeConnection () {
	let connStr = getConnectionString()
	console.log(`DB CONNECTION STRING: ${connStr}`)

	const db = new Sequelize(connStr, {
		logging: false
	})

	db.authenticate().then(() => {
		logger.info(`Database connected [db=${dbname}] [host=${host}] [port=${port}]`)
    }).catch((error) => {
        logger.error(`Error database conection errorString:"${error}"`)
		throw new Error(error)
    })

	return db
}

const database = sequelizeConnection()

if (!database) {
	console.log('Ошибка при подключении к базе данных');
	} else {
	module.exports = { database }
	}

