
var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'dash sketch never extend mind adjust robot will inhale want enhance slot';

module.exports = {
  compilers: {
     solc: {
       version: '^0.5.8'
     }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten2:  {
      network_id: 3,
      host: "localhost",
      port:  8545,
      gas:   2900000
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/1c8cfc1eee234138bde837e55d3738e3")
      },
      network_id: 3,
     
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    
  }
};