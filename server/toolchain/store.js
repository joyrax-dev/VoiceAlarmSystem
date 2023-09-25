const dataStore = require('data-store')
const { join } = require('path')

let store = null

const getStore = () => {
	if (store) {
		return store
	}
	else {
		store = dataStore({path: join(process.cwd(), 'store.json')})
		return store
	}
}

module.exports = {
	store: getStore(),
	getStore
}