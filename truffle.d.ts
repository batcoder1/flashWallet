declare type _contractTest = (accounts: string[]) => void;
declare function contract(name: string, test: _contractTest): void;
declare interface TransactionMeta {
  from: string,
}
declare interface TransactionMetaTokenSale {
  from: string,
  value: number,
}

declare interface Contract<T> {
  "new"(): Promise<T>,
  deployed(): Promise<T>,
  at(address: string): T,
}

declare interface CalileaTokenInstance {
  name():any;
  symbol():string;
  
  totalSupply():Promise<any>;
  balanceOf(account: string): Promise<any>;
  transfer(account: string, token:number, meta?:TransactionMeta): Promise<any>;
  approve(account: string, amount: number, meta?: TransactionMeta): Promise<any>;
  allowance(account1: string, account2: string, meta?: TransactionMeta): Promise<any>;
  transferFrom(fromAccount: string, toAccount: string, amount:number, meta?: TransactionMeta): Promise<any>;
}
declare interface TokenSaleInstance {
  address: any;
  tokenContract():Promise<any>;
  tokenPrice():Promise<any>;
  tokensSold(): Promise<any>;
  buyTokens(numTokens: number, meta?: TransactionMetaTokenSale): Promise<void>;
  endSale(meta?: TransactionMeta): Promise<void>;
}

interface Artifacts {
  require(name: "./contracts/CalileaToken.sol"): Contract<CalileaTokenInstance>,
  require(name: "./contracts/TokenSale.sol"): Contract<TokenSaleInstance>,
}

declare var artifacts: Artifacts;
