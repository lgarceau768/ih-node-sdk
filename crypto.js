const crypto = require('./crypto')
const config = require('./config')
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoinjs = require('bitcoinjs-lib')

function decrypt(key, text) {
    let iv = Buffer.from(text.iv, 'hex')
    let encryptedText = Buffer.from(text.encryptedData, 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

async function ecPairPriv(mnemonic) {
    if (typeof mnemonic !== 'string') {
        throw new Error('mnemonic expects a string')
    }

    const seed = await bip39.mnemonicToSeed(mnemonic)
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(config.PATH)
    const ecpair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, { compressed: false })
    return ecpair.privateKey
}

function encrypt(key, text) {
    let iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

function hash(text) {
    let sha256 = crypto.createHash('sha256')
    sha256.update(text)
    return sha256.digest(encoding = 'hex')
}

function mnemonic() {
    return bip39.generateMnemonic(256)
}

module.exports = {
    decrypt,
    ecPairPriv,
    encrypt,
    hash,
    mnemonic,
}
