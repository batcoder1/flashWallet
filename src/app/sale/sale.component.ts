import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';


 @Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  accounts: string[];
  rate = 0;
  etherAmount: any
  tokenSold: Number;
  progressPercent: Number;
  admin: Boolean;
  tokenSaleInstance: any;
  calileaInstance: any;

  tokensAvailable = 0;
  model = {
    ether: 0,
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    link: ''
  };
  numberOfTokens: Number;
  // rpsten enviroment
  // calileaAdminAccount = '0xE06bD7136488F4a03dccB5bb419329404D94be19'

  // ganache test environment
  calileaAdminAccount = environment.wallet;
  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
  }
  async ngOnInit() {
    this.admin = false;
    this.progressPercent = 0
    await this.watchAccount();
    await this.getInstance();

  }

  async getInstance() {
    try {
      console.log('Sale: getInstance....')
      this.tokenSaleInstance = await this.web3Service.getInstanceTokenSale()
      this.calileaInstance = await this.web3Service.getInstanceCalileaToken()

      this.rate = this.web3Service.toWei(await this.tokenSaleInstance.rate())
      console.log(`rate in: ${this.rate}`)
      if (this.tokenSaleInstance) {
        this.refreshTokenBalance();
      }
    } catch (err) {
      console.log('Calilea Token has not been found in this account: ' + err)

    }
  }
  async watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log(accounts)
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.admin = (this.model.account === this.calileaAdminAccount) ? true : false
      this.model.link = `https://ropsten.etherscan.io/address/${accounts[0]}`;



    });
  }
  async refreshTokenBalance() {
    try {
      console.log('RefresRokenBalance******************')
      let rate = await this.tokenSaleInstance.rate();
      this.tokensAvailable = Number(await this.tokenSaleInstance.tokensAvailable());
      console.log('tokensAvailable:'+this.tokensAvailable)
      console.log(rate.toString())

      let rateFormatted = rate
        ? this.web3Service.toEther(rate.toString())
        : 0
      console.log(rateFormatted)
      let tokenSold = Number(await this.tokenSaleInstance.tokensSold());
    
console.log('tokenSold: '+tokenSold)
      this.rate = rateFormatted
      this.tokenSold = tokenSold

      this.progressPercent = (Math.ceil(tokenSold) / this.tokensAvailable) * 100;
      console.log(this.progressPercent)
    } catch (err) {
      console.log(err)

    }
  }

  async buyTokens() {
    try {


      console.log(`tokenSaleInstance.address: ${this.tokenSaleInstance.address}`)
      console.log(`tokensAvailable: ${this.tokensAvailable}`)
      let rateBN = await this.tokenSaleInstance.rate();
      let rate= Number(rateBN.toString());
      console.log(rate)
      let etherValue =Number(this.numberOfTokens) * rate;
      console.log('etherValue: '+etherValue)


      let receipt = await this.tokenSaleInstance.buyTokens(this.model.account, {
        from: this.model.account,
        value:  etherValue,
        gas: 500000
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
  calculateEther(): any {
    this.etherAmount = Number(this.numberOfTokens) * this.rate;

  }

  async startIco() {
    let wallet = await this.tokenSaleInstance.wallet()
    console.log('wallet:' + wallet)
    

    let initialTokenAvailable = 5000000
    let initialTokenAvailableWei = this.web3Service.toWei(initialTokenAvailable.toString())
   
    await this.tokenSaleInstance.initializeIco(initialTokenAvailable, {
      from: wallet,
    })
    console.log('this.tokenSaleInstance.address:' + this.tokenSaleInstance.address)
    console.log('this.tokenSaleInstance.address:' + this.tokenSaleInstance.address)

    await this.calileaInstance.transfer(this.tokenSaleInstance.address, initialTokenAvailableWei,
      {
        from: wallet,
        gas: 500000
      });

  }
   


}
