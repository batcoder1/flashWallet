 

const TokenSale = artifacts.require('./contracts/TokenSale.sol');
var CalileaToken = artifacts.require("./contracts/CalileaToken.sol");


contract('TokenSale', async (accounts) => {
  let tokenInstance;
  let tokenSaleInstance;
  let admin = accounts[0];
  let buyer = accounts[1];
  let tokenPrice = 1000000000000000; // in wei
  let tokensAvailable = 5000000; // in wei
  let numberOfTokens;

  beforeEach('Setup', async () => {

    tokenInstance = await CalileaToken.deployed() 
    let contract = tokenInstance.address;
    tokenSaleInstance = await TokenSale.deployed()
   
  })
  it('initializes the contract with the correct values', async () => {
    
    let address =  tokenSaleInstance.address;
    
    let contract = await tokenSaleInstance.wallet();
    let _tokensAvailable = await tokenSaleInstance.tokensAvailable();
    let price = await tokenSaleInstance.rate();
    
    assert.notEqual(address, 0x0, 'has contract address');
    assert.notEqual(contract, 0x0, 'has token contract address');
    assert.equal(price, tokenPrice, 'token price is correct');
    assert.equal(tokensAvailable, _tokensAvailable, 'tokensAvailable is correct');
  });
  
  it('facilitates token buying', async() => {
    
    let tokensAvailable = await tokenSaleInstance.tokensAvailable();

    await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin})
    let rate = web3.utils.fromWei(await tokenSaleInstance.rate());
    
    let numberOfTokens = 1000;
    let etherValue = numberOfTokens * rate;
    let balanceTokenSale = await tokenInstance.balanceOf.call(tokenSaleInstance.address);

    receipt =  await tokenSaleInstance.buyTokens(buyer, {
        from: buyer,
        value: web3.utils.toWei(etherValue.toString(), "ether")
      })

 
    
    let tokensSold = await tokenSaleInstance.tokensSold();
    balanceTokenSale = await tokenInstance.balanceOf.call(tokenSaleInstance.address);
    let tokensAvailableAfterSale = await tokenSaleInstance.tokensAvailable();
    let balance =  await tokenInstance.balanceOf.call(buyer);
 
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'TokensPurchased', 'should be the "TokensPurchased" event');
    
    assert.equal(tokensSold.toString(), numberOfTokens, 'increments the number of tokens sold');
    assert.equal(balance, numberOfTokens);
    assert.equal(balanceTokenSale.toString(), tokensAvailable - numberOfTokens);
    assert.equal(tokensAvailableAfterSale.toString(), tokensAvailable - numberOfTokens);
    
    
    // Try to buy tokens different from the ether value 
    try{
      
       receipt = await tokenSaleInstance.buyTokens( buyer, {
           from: buyer,
           value: 10
        });
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    }

    try{
      numberOfTokens = 8000000
       etherValue = numberOfTokens * rate;

       receipt = await tokenSaleInstance.buyTokens(buyer, {
            from: buyer,
            value: web3.utils.toWei(etherValue.toString(), "ether")
          })
        
    }catch(error) {
      assert(error.message.includes("sender doesn't have enough funds to send tx"));
    }
  });

  it('ends token sale', async() => {
    
    // try endSale by not admin user
    try{  
      await tokenSaleInstance.endSale({
          from: buyer
        });
    }catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'must be admin to end sale');   
    }

      // End sale as admin
    await  tokenSaleInstance.endSale({from: admin});

    let balanceAdmin = await tokenInstance.balanceOf.call(admin);
     assert.equal(web3.utils.fromWei(balanceAdmin.toString(), "ether" ), 100000000, 'returns all unsold dapp tokens to admin');
    
     // Check that the contract has no balance
    let balance = await web3.eth.getBalance(tokenSaleInstance.address)
    assert.equal(balance, 0);
  });
});
