var CalileaToken = artifacts.require("./CalileaToken.sol");
var TokenSale = artifacts.require("./TokenSale.sol");


const config = require('../config/environments')

module.exports = function(deployer) {
  deployer.deploy(CalileaToken).then(function() {
    // Token price is 0.001 Ether
    var rate = 1000000000000000;
    
    // test environment
    //var wallet = '0x521bb3f773614219f64d4865904341e896971dd1'
    // ganache environment
    var wallet = config.wallet
    console.log(config.wallet)
    return deployer.deploy(TokenSale, wallet, CalileaToken.address, rate);
  });

};

