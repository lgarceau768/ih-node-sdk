
const crypto = require('./crypto')
const file = require('./file')
const wallet = require('./wallet')

async function load(path) {
  let data = null

  try {
    // If file exists then load, otherwise generate
    if (file.exists(path)) {
      data = file.read(path)
    } else {
      wallet.mnemonic = crypto.mnemonic()
      save(path, wallet.mnemonic)
      data = file.read(path)
    }

    if (!data) {
      throw new Error('wallet is unable to load or generate a mnemonic on load')
    }

    return {
      address: await wallet.getAddress(data),
      ecPairPriv: await crypto.ecPairPriv(data),
      mnemonic: data,
    }
  } catch(err) {
    console.trace(err)
  }
}

async function save(path, mnemonic) {
  try {
    if (!mnemonic) {
      throw new Error('wallet mnemonic missing for save')
    }

    file.write(path, mnemonic)
  } catch(err) {
    console.trace(err)
  }
}

module.exports = {
  load,
  save,
}
