const { DataTypes } = require('sequelize')
const { database } = require('../connection')

const Logs = database.define(
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
		code: {
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
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
)

module.exports = {
	Logs
}