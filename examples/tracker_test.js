const ih = require("../index")

// specify your wallet path here
const walletKey = "d1.key"

// function for sending lat / lng updates
async function sendUpdates() {
    
    for (let index = 0; index < 5; index++) {
        console.log('\n\nMSG #'+index.toString+ "\n")
        try {
            var walletPath = walletKey
            var lat = 35.227 + Math.random()
            var lng = -80.84 + Math.random()
            var rep = await ih.sendState({
                'lat': lat.toString(),
                'lng': lng.toString()
                // REPLACE BELOW WITH YOUR AES
            }, walletPath, "aesSecret", "aesIv");
            console.log(rep)
        } catch (e) {
            console.log(e)
        }    
    }
}

// function for creation of the device and seeing the qr code
async function createDevice() {
    var ret = await ih.setupWallet(walletKey)
    var adr = ret['wallet'].address()
    var qr = ret['qr_code']
    console.log('Address: '+adr+"\nQr Code:\n"+qr)
}

// specify which function to call (ideal)
// createDevice - called once on the creation of the device
// sendUpdate - called on a loop to keep the chain updated
createDevice()