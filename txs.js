
const config = require('./config')

function now() {
  return `${Math.floor(new Date() / 1000)}`
}

function device(tenant, signer, gateway, device, memo) {
  return {
    type: 'iotlock/Device',
    value: {
      tenant,
      signer,
      gateway,
      device,
      memo,
    },
  }
}

function pin(tenant, signer, device, expiration, number, memo) {
  return {
    type: 'iotlock/PIN',
    value: {
      tenant,
      signer,
      device,
      expiration,
      number,
      memo,
    },
  }
}

function send(to, from, amount, denom = config.DENOM) {
  return {
    type: 'cosmos-sdk/MsgSend',
    value: {
      from_address: from,
      to_address: to,
      amount: [{amount, denom}],
      timestamp: now(),
    },
  }
}

function state(tenant, signer, device, attributes) {
  if (typeof(attributes) === 'object') {
    let s = []
    for (let [k, v] of Object.entries(attributes)) {
      s.push(`${k}=${v}`)
    }
    attributes = s.join(';')
  }

  return {
    type: 'iotlock/State',
    value: {
      tenant,
      signer,
      device,
      attributes,
    },
  }
}

function subscription(tenant, signer, subscription, device, expiration, memo) {
  return {
    type: 'itshere/Subscription',
    value: {
      tenant,
      signer,
      subscription,
      device,
      expiration,
      memo,
    },
  }
}

function tenant(tenant, signer, adminThreshold, threshold, memo) {
  return {
    type: 'itshere/Tenant',
    value: {
      tenant,
      signer,
      adminThreshold,
      threshold,
      memo,
    },
  }
}

function user(tenant, signer, user, weight, memo) {
  return {
    type: 'itshere/User',
    value: {
      tenant,
      signer,
      user,
      weight,
      memo,
    },
  }
}

module.exports = {
  device,
  pin,
  send,
  state,
  subscription,
  tenant,
  user,
}
