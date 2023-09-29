const { Store } = require('data-store')
const { join } = require('path')

const store = new Store(join(process.cwd(), 'store.json'))

module.exports = {
	store
}