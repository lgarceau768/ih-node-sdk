# IH Node SDK

This is the It's Here Application Chain SDK. Developers can use this tool to connect there existing node applications to their devices on the IH Chain, or create new applications with this! The readme file will provide a simple overview of some of the requirements of the sdk. It will be divided up into several sections:

1. #### Requirements

2. #### Installation

3. #### Setup (Pre Use)

4. #### Usage & Functionality



## Requirements

- NodeJS 
  - current version
- NPM
  - current version



## Installation

1. Create your project

   ```bash
   npm init 
   ```

2. Install the ih-node-sdk

   ```bash
   npm i ih-node-sdk --save
   ```

3. Look at our Setup Section!

   

## Setup & Pre Use

In order to begin developing with the IH Chain there are some things you must understand about how the chain works! Basically with the SDK or the Application you are able to create a user account and add devices to the chain. With these devices that you add you are able to add attributes to the devices. We have some predefined attributes such as *Lock*, *Lat, Lng, Flag*  which also have some functionality for connecting back to the chain through the application, but users are also able to create custom attributes and then view them in the application, but with the sdk you are able to take custom attributes to a whole new level by being able to query the chain and view the device state. 

One of the main parts of the IH Chain that ensures privacy on a public blockchain is by having users be able to encrypt there device attributes with an AES Secret Key and AES IV String. The main mode of attribute encryption is Password AES 128bit CBC.



## Usage & Functionality

- getTenant(***deviceAddress***)
  - Parameter
    - deviceAddress, the string value of the address of the device you would like to get the tenant of
  - Return Value
    - String of the tenant address
- setupWallet(***walletName***)
  - Parameter
    - the walletName is the local name of your wallet, or the name of the saved file of your wallet
  - Return Value
    - Wallet object from the IH Sdk
- sendState(***state, deviceAddress, wallet, aesSecret, aesIv***)
  - Parameter
    - state
      - Map of string key / value pairs which contain the variables that your device tracks
    - deviceAddress
      - the string value of the device address you wish to update
    - wallet
      - Wallet object -< should get from setupWallet
    - aesSecret
      - String hexadecimal value of the AES Secret key used for attribute encryption on the given device
    - aesIv
      - String hexadecimal value of the AES IV String used for attribute encryption
  - Return Value
    - A json variable containing the IH API response to the api call
- getChainEvents(***address, aesSec, aesIv***)
  - Parameter
    - deviceAddress
      - the string value of the device address you wish to update
    - aesSecret
      - String hexadecimal value of the AES Secret key used for attribute encryption on the given device
    - aesIv
      - String hexadecimal value of the AES IV String used for attribute encryption
  - Return Value
    - An array of json variables containing the current state updates (decrypted attribute updates of the requested device)
- getDeviceAddress()
  - Return Value
    - A string value containing an address that can be used to register a device  

## Examples  
[Tracker Example](https://pastebin.com/pmM3PpHB)  
[Twilio Chain Watcher Example](https://pastebin.com/FcJpHmVC)  

