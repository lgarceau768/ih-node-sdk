
const fs = require('fs')

function exists(path) {
  if (!path) throw new Error('file path missing for exists')
  return fs.existsSync(path)
}

function read(path) {
  if (!path) throw new Error('file path missing for read')
  return fs.readFileSync(path, 'ascii')
}

function write(path, data) {
  if (!path) throw new Error('file path missing for write')
  if (!path) throw new Error('file data missing for write')
  return fs.writeFileSync(path, data, 'ascii')
}

module.exports = {
  exists,
  read,
  write,
}
