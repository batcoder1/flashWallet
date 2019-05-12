import { AppPage } from './app.po';
import { expect } from 'chai';

describe('Flash Wallet App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getHeader()).has('Flash Wallet');
  });
});
