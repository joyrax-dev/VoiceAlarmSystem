const { storeFile } = require('../config.json')
const { Store } = require('data-store')
const { join } = require('path')

const store = new Store(storeFile, {
	path: join(process.cwd(), storeFile)
})

module.exports = {
	store
}