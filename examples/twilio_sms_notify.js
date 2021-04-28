const ih = require('../index')

// Author Luke Garceau
// example will use twilio to notify a user when a message has occured on the blockchain
// This program is a watcher for the chain and will send a user a text message whenever the a given device on the chain has a given attribute with the specified value


// Twilio Variables
const accountSID = "";
const authToken = "";
const client = require("twilio")(accountSID, authToken)

// IH Variables
const deviceAdrCheck = "";
const aesSec = "";
const aesIV = "";

// Program Variables
const attribute = "lock"
const notifyVal = 1;
const phone = "";
const from = "";

// Logic

async function sendTxt(val){
    client.messages
        .create({
            body: `Your IoT Device has been locked! And set to ${val}`,
            from: from,
            to: phone
        })
        .then(message => console.log(message.sid))
}

async function checkChain(){
    while (true) {
        const rep = await ih.getChainEvents(deviceAdrCheck, aesSec, aesIV);
        for (let index = 0; index < rep.length; index++) {
            const message = array[index];
            try {
                if(message['attributes'][attribute] == notifyVal){
                    sendTxt(message)
                }
            } catch (e) {
                console.log(`Exception in checkChain() ${e}`)
            }
        }
    }
}

checkChain()