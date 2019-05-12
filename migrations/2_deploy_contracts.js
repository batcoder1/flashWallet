var CalileaToken = artifacts.require("./CalileaToken.sol");
var TokenSale = artifacts.require("./TokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(CalileaToken).then(function() {
    // Token price is 0.001 Ether
    var rate = 1000000000000000;
    var initialTokensAvailable = 5000000;
    var wallet = '0xf7E950caC3B61d7092242F87d800Be90D3272f9E'
    return deployer.deploy(TokenSale, wallet, CalileaToken.address, rate, initialTokensAvailable);
  });

};

