const rpc = require('./rpc')
const crypto = require('./crypto')
const crypt = require('crypto')
const txs = require('./txs')
const wallet = require('./wallet')
const keybase = require('./keybase')
const sha256 = require('sha256')
const utf8 = require('utf8')
const QRCode = require('qrcode')

function encrypt(payload, aesSec, aesIv){
    var keyObj = sha256(aesIv).slice(0, 32)
    var ivObj = sha256(aesSec).slice(0, 16)
    var hash = Buffer.from(payload, 'utf8')
    var cipher = crypt.createCipheriv('aes-256-cbc', 
        keyObj, 
        ivObj)
    let decrypted = Buffer.concat([cipher.update(hash), cipher.final()])
    let ret = decrypted.toString('hex')
    return ret
}

function decrypt(payload, aesSec, aesIv){
    // convert to hex 
    var keyObj = sha256(aesIv).slice(0, 32)
    var ivObj = sha256(aesSec).slice(0, 16)
    var hash = Buffer.from(payload, 'hex')
    var decipher = crypt.createDecipheriv('aes-256-cbc', 
        keyObj, 
        ivObj)
    let decrypted = Buffer.concat([decipher.update(hash), decipher.final()])

    return decrypted.toString('utf8')
}

/**
 * Will retrieve the tenant on the requested device
 * address
 * 
 * @param {string} device_address Device Adress
 * @return {string} tenant_address Tenant Address to the device
 */
async function getTenant(deviceAddress) {
    if(deviceAddress == null || deviceAddress == ""){
        throw "Device Address cannot be null"
        return
    }
    try {
        device = await rpc.getDetail(deviceAddress)
        return device['tenant']
    } catch (e) {
        throw `Exception ${e.toString()} thrown in getTenant(${deviceAddress})`
    }
}

/**
 * Will setup the wallet for the user
 * 
 * @param {string} walletName Name of your wallet (will be stored in this directory)
 * @return {wallet, qrcode} wallet object  and qr code in a map
 */
async function setupWallet(walletName){    
    if(walletName == null || walletName == ""){
        throw "Wallet Name cannot be null"
    }
    try {
        data = await keybase.load(walletName)
        wallet.setup(data)
        var qrCode = 'none'
        QRCode.toString(wallet.address(),{type:'terminal'},
                function (err, QRcode) {

            if(err) return console.log("error occurred")

            // Printing the generated code
            qrCode = QRcode
        })
        return {
            "wallet": wallet,
            "qr_code": qrCode
        }
    } catch (e) {
        throw `Exception ${e.toString()} thrown in setupWallet(${walletName})`
    }
}

/**
 * Send a state update of this device to the chain
 * 
 * @param {Json} attributes Map of the attributes to send
 * @param {walletPath} walletPath walletPath of the user
 * @return {Json} result
 */
async function sendState(state, walletPath, aesSec, aesIv) {
    var wallet = await keybase.load(walletPath)
    var nState = {}
    if(state == null){
        nState = state
        throw "State/Attributes cannot be null"
    } else {
        for(var key of Object.keys(state)){
            try {
                var nKey = encrypt(key, aesSec, aesIv)
                var nVal = encrypt(state[key], aesSec, aesIv)
                nState[nKey] = nVal
            } catch (e) {
                console.log(`Exception ${e}`)
            }
        }
    }
    if(walletPath == null){
        throw "Wallet cannot be null"
    } 
    var user_address = wallet.address
    try {
        var device_tenant = await getTenant(user_address)
        const msg = txs.state(device_tenant, user_address, user_address, nState)
        const tx = await rpc.newTx(user_address, [msg])
        const utx = rpc.unsignTx(tx)
        const stx = await rpc.signTx(utx, wallet.ecPairPriv, 'block')
        const rep = await rpc.broadcast(stx)
        return rep
    } catch (e) {
        throw `Exception ${e} in sendAttributes(${nState.toString()}, ${device_address})`
    }
}

/**
 * Will query the events on the chain and return them to the user
 * @param {address} The string address of the device
 * @param {aesSec} The string hex value of the aes secret key the device owner used
 * @param {aesIv} The string hex value of the secret iv the device owner used
 */
async function getChainEvents(address, aesSec, aesIv){

    let resp = await rpc.queryEvents(address, 100)
    let events = []
    if (!resp.error) {
        // successfully made the request
        //console.log('response', resp)
        let txs = resp.data.txs
        txs.forEach(element => {
            let tx = element.tx.value
            let msgs = tx.msg
            msgs.forEach(msg => {
                if (msg.type == 'iotlock/State') {
                    let nonSplit = msg.value.attributes
                    // check to see whether to split off of ; or & 
                    let pairs = nonSplit.split(';')
                    let attributes = {}
                    pairs.forEach(async function(element){
                        try {
                            let key = element.split('=')[0]
                            let value = element.split('=')[1]
                            // now need to decrypt and encrypt
                            console.log(`Key: ${key}\nValue: ${value}`)
                            var nKey = decrypt(key, aesSec, aesIv).trim().replace("\\u000c", "")
                            var nVal = decrypt(value, aesSec, aesIv).trim().replace('\\f')
                            var index = nVal.indexOf('\u000f');
                            if(index != -1){
                                nVal = nVal.substring(0, index)
                            }
                            attributes[nKey] = nVal; 
                        } catch (ex) {
                            console.log(`Exception ${ex}`)
                        }
                    })
                    let timestamp = element.timestamp
                    timestamp = new Date(timestamp)
                    events.push({
                        "timestamp": timestamp,
                        "attributes": attributes
                    })
                }
            })
        })
        events.forEach((item, i) => {
            item[2] = i
        })
        return events;
    }
}

/**
 * Function to create a device address 
 * @return Map with mnemonic and address
 */
async function getDeviceAddress(){
    var mnemonic = crypto.mnemonic();
    var address = await wallet.getAddress(mnemonic);
    return {
        'mnemonic': mnemonic.toString(),
        'address': address.toString()
    }
}

module.exports = {
    getTenant: getTenant,
    setupWallet: setupWallet,
    sendState: sendState,
    getChainEvents: getChainEvents,
    getDeviceAddress: getDeviceAddress
}