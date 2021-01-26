const { BN } = require("@openzeppelin/test-helpers/src/setup");
const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

const CoreOrchestrator = artifacts.require("CoreOrchestrator");
const Core = artifacts.require("Core");
const Fei = artifacts.require("Fei");
const IUniswapV2Pair = artifacts.require("IUniswapV2Pair");
const EthBondingCurve = artifacts.require("EthBondingCurve");
const UniswapIncentive = artifacts.require("UniswapIncentive");
const FeiRouter = artifacts.require("FeiRouter");

module.exports = async function(callback) {
  let accounts = await web3.eth.getAccounts();
  let co = await CoreOrchestrator.deployed();
  let core = await Core.at(await co.core());
  let fei = await Fei.at(await core.fei());

  let ethPair = await IUniswapV2Pair.at(await co.ethFeiPair());
  let ui = await UniswapIncentive.at(await co.uniswapIncentive());
  
  let ethAmount = new BN('100000000000000000000000');
  let feiTotal = ethAmount.mul(new BN('1000000'));
  let router = await FeiRouter.deployed();
  await core.grantMinter(accounts[0], {from: accounts[0]});
  await core.grantBurner(accounts[0], {from: accounts[0]});

  await fei.mint(accounts[0], feiTotal);
  await fei.approve(router.address, feiTotal, {from: accounts[0]});
  await ui.updateOracle();

  console.log('Current');

  let reserves = await ui.getReserves();
  let price = reserves[0].div(reserves[1]);
  let peg = await ui.peg();
  let pegBN = new BN(peg.value).div(new BN('1000000000000000000'));
  console.log(price);
  console.log(pegBN);

  console.log('Sync');
  let targetFei = reserves[1].mul(pegBN);
  let currentFei = await fei.balanceOf(ethPair.address);

  await fei.burnFrom(ethPair.address, currentFei, {from: accounts[0]});
  await fei.mint(ethPair.address, targetFei, {from: accounts[0]});
  await ethPair.sync();

  await ui.setExemptAddress(accounts[0], true, {from: accounts[0]});

  console.log('Selling At');
  reserves = await ui.getReserves()
  let twoPercent = reserves[0].div(new BN('50'));
  let maxBurn = twoPercent;
  let sell = await router.sellFei(maxBurn, twoPercent, 0, accounts[0], MAX_UINT256, {from: accounts[0]});
  console.log(sell);

  console.log('Buying Below');
  reserves = await ui.getReserves();
  let buy = await router.buyFei(0, 0, accounts[0], MAX_UINT256, {value: twoPercent.mul(new BN('2')), from: accounts[0]});
  console.log(buy);

  console.log('Buying Above');
  reserves = await ui.getReserves();
  buy = await router.buyFei(0, 0, accounts[0], MAX_UINT256, {value: twoPercent, from: accounts[0]});
  console.log(buy);

  console.log('Selling Above');
  reserves = await ui.getReserves();
  sell = await router.sellFei(maxBurn, twoPercent, 0, accounts[0], MAX_UINT256, {from: accounts[0]});
  console.log(sell);

  callback();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stringify(bn) {
  let decimals = new BN('1000000000000000000');
  return bn.div(decimals).toString();
}
