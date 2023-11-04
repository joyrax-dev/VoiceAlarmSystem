export function ExtractFunctionName(func) {
    var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString())

    return result ? result[1] : ''
}