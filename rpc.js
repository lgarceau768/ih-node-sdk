
const fetch = require('./fetch')
const config = require('./config')
const crypto = require('crypto')
const secp256k1 = require('secp256k1')
const util = require('./util')
const axios = require('axios')

const _fee = {amount: [{amount: config.FEE, denom: config.DENOM}], gas: config.GAS}

function broadcast(stx) {
  return fetch.post('/txs', stx)
}

function getAccounts(address) {
  return fetch.get(`/auth/accounts/${address}`).then(res => {
    // console.log('getAccounts res:', res)
    return {
      account_number: res.result.value.account_number,
      address: res.result.value.address,
      coins: res.result.value.coins,
      height: res.height,
      sequence: res.result.value.sequence,
    }
  })
}

function getDetail(address) {
  return fetch.get(`/iotlock/detail/${address}`).then(res => res.result)
}

function getDevice(address) {
  return fetch.get(`/iotlock/device/${address}`).then(res => res.result)
}

function getDeviceState(address) {
  return fetch.get(`/iotlock/state/${address}`).then(res => res.result)
}

function getPubKeyBase64(ecpairPriv) {
  const pubKeyByte = secp256k1.publicKeyCreate(ecpairPriv)
	return Buffer.from(pubKeyByte, 'binary').toString('base64')
}

async function newTx(address, msgs, fee = _fee, memo = '') {
    const data = await getAccounts(address)
    // console.log('newTx data:', data)
    // console.log('newTx fee:', fee)
    // console.log('newTx msgs:', msgs)
    console.log(data)
    return {
      chain_id: config.CHAIN_ID,
      account_number: String(data.account_number),
      sequence: String(data.sequence),
      fee,
      msgs,
      memo,
    }
}

function signTx(utx, ecPairPriv, modeType = 'block') {
  // The supported return types includes:
  //  'block'(return after tx commit)
  //  'sync'(return after CheckTx)
  //  'async'(return right away)
  let signMessage = utx.json
  const sortedJson = util.sortObject(signMessage)
  const sortedJsonStr = JSON.stringify(sortedJson)
  const hash = crypto.createHash('sha256').update(sortedJsonStr).digest('hex')
  const buf = Buffer.from(hash, 'hex')
  let signObj = secp256k1.ecdsaSign(buf, ecPairPriv)
  var signatureBase64 = Buffer.from(signObj.signature, 'binary').toString('base64')
  let signedTx = {
    'tx': {
      'msg': utx.json.msgs,
      'fee': utx.json.fee,
      'signatures': [
        {
          'signature': signatureBase64,
          'pub_key': {
            'type': 'tendermint/PubKeySecp256k1',
            'value': getPubKeyBase64(ecPairPriv),
          }
        }
      ],
      'memo': utx.json.memo,
    },
    'mode': modeType,
  }

  return signedTx
}

function unsignTx(input) {
  const utx = new Object
  utx.json = input

  const sortedJson = util.sortObject(utx.json)
  const sortedJsonStr = JSON.stringify(sortedJson)
  utx.bytes = util.convertStringToBytes(sortedJsonStr)
  return utx
}

function queryEvents(deviceAddress, filter){
  let res = axios({
   method: 'get',
   url: `${config.RPC}/txs?message.device=`+deviceAddress.toString()+`&limit=${filter}`,
   responseType: 'json',
   headers: {...config.HEADERS}  
  }).then(function(res){
    //console.log('success', res)
    return res
  }).catch(function(res){
    //console.log('error', res)
    return JSON.parse('{response: {error: true, description: "error making the request"}}')
  })
  return res

}

module.exports = {
  broadcast,
  getAccounts,
  getDetail,
  getDevice,
  getDeviceState,
  newTx,
  signTx,
  unsignTx,
  queryEvents
}
