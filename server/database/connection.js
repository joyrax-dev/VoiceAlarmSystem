const { Sequelize } = require('sequelize')
const { logger } = require('../services')
const { database } = require('../config.json')

let sequelize = null

const getConnectionString = () => {
	return `postgres://${database.user}:${database.pass}@${database.host}:${database.port}/${database.dbname}`
}

const sequelizeConnection = () => {
	let connStr = getConnectionString()

	sequelize = new Sequelize(connStr)

	sequelize.authenticate().then(() => {
        console.log('Подключение к базе данных установлено')
		logger.info(`Database connected [db=${database.dbname}] [host=${database.host}] [port=${database.port}]`)
    }).catch((error) => {
        logger.error(`Error database conection errorString:"${error}"`)
		throw new Error(error)
    })
}

const getDatabase = () => {
	if (sequelize) {
		return sequelize
	}
	else {
		sequelizeConnection()
		return sequelize
	}
}

module.exports = {
	sequelizeConnection,
	getDatabase,
	database: getDatabase()
}