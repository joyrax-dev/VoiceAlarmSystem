const { extname, } = require('path')
const { readdirSync, statSync } = require('fs')

// dir - string, skip - array[string]
const requireHandlers = (dir, skip) => {
	let handlers = []

	let fileList = readdirSync(dir)

	for (const file of fileList) {
		let name = `${dir}/${file}`

		if (statSync(name).isFile()) {
			if (extname(name) == '.js') {
				if (ifmatches(name, skip)) {
					continue
				}

				handlers.push(require(name))
			}
		}
	}

	return handlers
}
// file - string, skip - array[string]
const ifmatches = (file, skip = []) => {
	for (const skipFile of skip) {
		if (file.endsWith(skipFile)) {
			return true
		}
	}

	return false
}

module.exports = {
	handlers: () => {
		return requireHandlers(__dirname, ['index.js'])
	}
}