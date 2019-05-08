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
  tokenPrice: 1000000000000000;
  tokenSold: Number;
  progressPercent: Number;

  tokenInstance: any;

  tokensAvailable = 750000;
  model = {
    ether: 0,
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    link: ''
  };
  numberOfTokens = 0;

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
      console.log(this.tokenInstance)
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
    let tokenPrice = await this.tokenInstance.tokenPrice();

    console.log(tokenPrice)

    let tokenPriceFormatted = tokenPrice 
        ? this.web3Service.toEther(tokenPrice.toString())
        : 0
console.log(tokenPriceFormatted)
    let tokenSold = await this.tokenInstance.tokensSold();
    let tokenSoldFormatted = Number(tokenSold)

    this.tokenPrice = tokenPriceFormatted
    this.tokenSold = tokenSoldFormatted

    this.progressPercent = (Math.ceil(tokenSoldFormatted) / this.tokensAvailable) * 100;
    console.log(this.progressPercent)
  }

  async buyTokens() {
    try {
      console.log(this.numberOfTokens)
      console.log(this.tokenPrice)
      this
      let valueSale = this.numberOfTokens * this.tokenPrice
      console.log(valueSale)
      let valueSaleWei = this.web3Service.toWei(valueSale)
      let result = await this.tokenInstance.buyTokens(this.numberOfTokens, {
        from: this.model.account,
        value: valueSaleWei,
        gas: 500000 // Gas limit)

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

}
