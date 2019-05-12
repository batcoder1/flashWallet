 

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
    
    let address =  tokenSaleInstance.address
    
    let contract = await tokenSaleInstance.tokenContract();
    let _tokensAvailable = await tokenSaleInstance.tokensAvailable();
    let price = await tokenSaleInstance.tokenPrice();
    
    assert.notEqual(address, 0x0, 'has contract address');
    assert.notEqual(contract, 0x0, 'has token contract address');
    assert.equal(price, tokenPrice, 'token price is correct');
    assert.equal(tokensAvailable, _tokensAvailable, 'tokensAvailable is correct');
  });
  
  it('facilitates token buying', async() => {
    
  
    //await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin})
    
    let numberOfTokens = 10;
    let value = numberOfTokens * tokenPrice;
    let balanceCalilea =  await tokenInstance.balanceOf.call(tokenInstance.address)
    console.log('contract:'+tokenInstance.address)
    console.log('balance:'+balanceCalilea)
    console.log('tokenSaleAddress:'+tokenSaleInstance.address)
    let balanceTokenSale = await tokenInstance.balanceOf.call(tokenSaleInstance.address);
    console.log('balanceTokenSale:'+balanceTokenSale)
    receipt =  await tokenSaleInstance.buyTokens(numberOfTokens, {
        from: buyer,
        value: value
      })

 
    
    let amount = await tokenSaleInstance.tokensSold();
    
    let balance =  await tokenInstance.balanceOf.call(buyer);
    console.log('balanceTokenSale:'+balanceTokenSale)

    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
    
    assert.equal(amount, numberOfTokens, 'increments the number of tokens sold');
    assert.equal(balance, numberOfTokens);
    assert.equal(balanceTokenSale, tokensAvailable - numberOfTokens);
    
    
    // Try to buy tokens different from the ether value 
    try{
       receipt = await tokenSaleInstance.buyTokens(numberOfTokens, {
           from: buyer,
           value: 1
        });
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    }

    try{
       receipt = await tokenSaleInstance.buyTokens(800000, {
            from: buyer,
            value: numberOfTokens * tokenPrice
          })
        
    }catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
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
