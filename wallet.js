const bip32 = require('bip32')
const bip39 = require('bip39')
const bech32 = require('bech32')
const config = require('./config')

const wallet = {
    address: null,
    ecPairPriv: null,
    mnemonic: null,
}

function address() {
    return wallet.address
}

function ecPairPriv() {
    return wallet.ecPairPriv
}

async function getAddress(mnemonic) {
    if (typeof mnemonic !== 'string') {
        throw new Error('mnemonic expects a string')
    }

    const seed = await bip39.mnemonicToSeed(mnemonic)
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(config.PATH)
        // 
    const words = bech32.toWords(child.identifier)
    //console.log(child)
    return bech32.encode(config.PREFIX, words)
}

function setup(data) {
    wallet.address = data.address
    wallet.ecPairPriv = data.ecPairPriv
    wallet.mnemonic = data.mnemonic
}


module.exports = {
    address,
    ecPairPriv,
    getAddress,
    setup,
}