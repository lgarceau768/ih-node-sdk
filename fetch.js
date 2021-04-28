
require('es6-promise').polyfill()
require('isomorphic-fetch')
const config = require('./config')

function get(route, options = {}) {
  return request(null, route, {...options, method: 'GET'})
}


function post(route, data = {}, options = {}) {
  return request(null, route, {...options, method: 'POST', body: JSON.stringify(data)})
}

function request(host, route, options) {
  const url = `${host || config.RPC}${route}`

  options = {
    headers: {...config.HEADERS, ...options.headers},
    ...options,
  }

  return fetch(url, options)
    .then(async res => {
      const json = await res.json()
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      return json
    })
}


module.exports = {
  get,
  post,
  request,
}
