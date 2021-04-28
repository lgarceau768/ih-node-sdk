
function convertStringToBytes(str) {
	if (typeof str !== 'string') {
    throw new Error('str expects a string')
	}
	let myBuffer = []
	let buffer = Buffer.from(str, 'utf8')
	for (let i = 0; i < buffer.length; i++) {
    myBuffer.push(buffer[i])
	}
	return myBuffer
}

function sortObject(obj) {
	if (obj === null) return null
	if (typeof obj !== 'object') return obj
	if (Array.isArray(obj)) return obj.map(sortObject)
	const sortedKeys = Object.keys(obj).sort()
	const result = {}
	sortedKeys.forEach(key => {
		result[key] = sortObject(obj[key])
	})
	return result
}

module.exports = {
  convertStringToBytes,
  sortObject,
}
