
import { ABI } from "./abi.js"

var Web3 = require('web3')
export var contract_addr = process.env.BINANCE_CONTR;
export var web3 = new Web3(new Web3.providers.HttpProvider(process.env.BINANCE))

export const getEthBalance = async (account) => {
  var balanceWei = await web3.eth.getBalance(account || web3.eth.defaultAccount);
  var balance = await web3.utils.fromWei(balanceWei, 'ether');
  return balance;
};

export const getWalletBalance = async (account) => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var bal = await tokenContract.methods.balanceOf(account).call(function (err, res) {
    if (err) {
      console.log("error:", err)
      return
    }
    return
  })
  //return web3.utils.fromWei(bal)
  return bal
};

export const getTokenName = async () => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var name = await tokenContract.methods.name().call(function (err, res) {
    if (err) {
      console.log("error:", err)
      return
    }
    return
  })
  return name
};

export const getTokenSymbol = async () => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var symbol = await tokenContract.methods.symbol().call(function (err, res) {
    if (err) {
      console.log("error:", err)
      return
    }
    return
  })
  return symbol
};

export const getTotalSupply = async () => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var supply = await tokenContract.methods.totalSupply().call(function (err, res) {
    if (err) {
      console.log("error:", err)
      return
    }
    return
  })
  return supply
};

export const getTokenPrice = async () => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var price = await tokenContract.methods.tokenPrice().call(function (err, res) {
    if (err) {
      console.log("error:", err)
      return
    }
    return
  })
  return web3.utils.fromWei(price)
};

export const owhBalanceOf = async (address) => {
  var tokenContract = new web3.eth.Contract(ABI, contract_addr);
  var balance = -1;
  try {
    balance = await tokenContract.methods.owhBalanceOf(address).call(function (err, res) { })
  } catch { }
  return balance
};

