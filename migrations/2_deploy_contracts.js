var CalileaToken = artifacts.require("./CalileaToken.sol");
module.exports = function(deployer) {
  deployer.deploy(CalileaToken);
};

