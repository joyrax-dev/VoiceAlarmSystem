class Toolchain {
	constructor() {}

	// Match:
	// - ^          the beginning of the string
	// - function   the word 'function'
	// - \s+        at least some white space
	// - ([\w\$]+)  capture one or more valid JavaScript identifier characters
	// - \s*        optionally followed by white space (in theory there won't be any here,
	//              so if performance is an issue this can be omitted[1]
	// - \(         followed by an opening brace
	extractFunctionName(func) {
		var result = /^function\s+([\w\$]+)\s*\(/.exec( func.toString() )

		return  result  ?  result[ 1 ]  :  ''
	}
}

const toolchain = new Toolchain()

module.exports = {
	toolchain
}