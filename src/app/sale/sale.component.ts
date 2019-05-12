import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  accounts: string[];
  rate = 0; 
  etherAmount:any
  tokenSold: Number;
  progressPercent: Number;

  tokenInstance: any;
  calileaInstance: any;

  tokensAvailable = 750000;
  model = {
    ether: 0,
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    link: ''
  };
  numberOfTokens:Number;

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
  }
  async ngOnInit() {
    this.progressPercent = 0
    await this.watchAccount();
    await this.getInstance();
  }

  async getInstance() {
    try {
      console.log('getInstance....')
      this.tokenInstance = await this.web3Service.getInstanceTokenSale()
      this.calileaInstance = await this.web3Service.getInstanceCalileaToken()
      
      if (this.tokenInstance) {
        this.refreshTokenBalance();
      }
    } catch (err) {
      console.log('Calilea Token has not been found in this account')

    }
  }
  async watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log(accounts)
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.model.link = `https://ropsten.etherscan.io/address/${accounts[0]}`;



    });
  }
  async refreshTokenBalance() {
    let rate = await this.tokenInstance.rate();

    console.log(rate)

    let rateFormatted = rate 
        ? this.web3Service.toEther(rate.toString())
        : 0
console.log(rateFormatted)
    let tokenSold = await this.tokenInstance.tokensSold();
    let tokenSoldFormatted = Number(tokenSold)

    this.rate = rateFormatted
    this.tokenSold = tokenSoldFormatted

    this.progressPercent = (Math.ceil(tokenSoldFormatted) / this.tokensAvailable) * 100;
    console.log(this.progressPercent)
  }

  async buyTokens() {
    try {
      let calileaTokenAddress = '0xE06bD7136488F4a03dccB5bb419329404D94be19'

      let numtokensTotales = await this.calileaInstance.balanceOf.call(calileaTokenAddress)
      let numTokensIcoAvailables = await this.tokenInstance.tokensAvailable.call()
      console.log(`numtokensTotales: ${numtokensTotales}`)
      console.log(`numTokensIcoAvailables: ${numTokensIcoAvailables}`)
   
      this.rate = this.web3Service.toWei(await this.tokenInstance.rate())
      console.log(`rate: ${this.rate}`)
    
      let receipt = await this.tokenInstance.buyTokens( this.model.account, {
        from: this.model.account,
        value: this.web3Service.toWei(this.etherAmount)
       
      }) 
      
     
      this.numberOfTokens = 0
      this.setStatus('Tokens bought successfully!!!')
    } catch (err) {
      this.setStatus('Error in sale process, please, try again')
      console.log(err)
    }

  }
  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }
  calculateEther():any{
    this.etherAmount = Number(this.numberOfTokens) * this.rate;
    
  }

}
