const { store } = require('../config.json')
const { Store } = require('data-store')
const { join } = require('path')

const store = new Store(store, {
	path: join(process.cwd(), store)
})

module.exports = {
	store
}