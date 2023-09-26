const { Sequelize, DataTypes } = require('sequelize')
const { getDatabase } = require('../connection')

const db = getDatabase()

const Logs = db.define(
	'Logs',
	{
		date: {
			type: DataTypes.STRING,
			allowNull: false
		},
		time: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		categories: {
			type: DataTypes.STRING,
			allowNull: false
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		data: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false
		},
		source: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}
)

module.exports = {
	Logs
}