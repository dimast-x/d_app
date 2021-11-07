import type { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { MetaMaskLogo } from './MetaMaskLogo';
import { getWalletBalance, getTokenName, getTokenSymbol, getTotalSupply, getTokenPrice, getEthBalance, owhBalanceOf } from '../scripts/getbalance.js';
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 97, 1337] });
export var network_id: any;
export var contract_addr: any;
declare let window: any;
var Web3 = require('web3')
export var web3: any;

var binance = process.env.BINANCE;
var ropsten = process.env.ROPSTEN;
var binance_contr = process.env.BINANCE_CONTR;
var ropsten_contr = process.env.ROPSTEN_CONTR;
var web3_binance = new Web3(new Web3.providers.HttpProvider(binance))
var web3_ropsten = new Web3(new Web3.providers.HttpProvider(ropsten))


const Home: NextPage = () => {
  const {
    account,
    activate,
    active,
    connector,
    library,
  } = useWeb3ReactCore<Web3Provider>();

  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  const [balance, setBalance] = React.useState();
  const [tokenName, setTokenName] = React.useState<any>();
  const [tokenSymbol, setTokenSymbol] = React.useState<any>();
  const [totalSupply, setTotalSupply] = React.useState<any>();
  const [tokenPrice, setTokenPrice] = React.useState<any>();
  const [ethBalance, setEthBalance] = React.useState<any>();
  const [owhAccount, setOwhAccount] = React.useState<any>();
  const [owhBalance, setOwhBalance] = React.useState<any>();
  const [amount, setAmount] = React.useState<any>();
  const [mainCurrency, setmainCurrency] = React.useState<any>("ETH");
  const [info, setInfo] = React.useState<any>();

  async function fetchBalance() {
    const updatedBalance = await getWalletBalance(account);
    const name = await getTokenName();
    const symbol = await getTokenSymbol();
    const supply = await getTotalSupply();
    const price = await getTokenPrice();
    const eth = await getEthBalance(account);

    setBalance(updatedBalance);
    setTokenName(name);
    setTokenSymbol(symbol);
    setTotalSupply(supply);
    setTokenPrice(price);
    setEthBalance(eth);
  }



  React.useEffect(() => {
    if (account) {
      fetchBalance();
    }
    if (activatingConnector &&
      activatingConnector === connector &&
      account
    ) {
      setActivatingConnector(undefined);
    }





  }, [activatingConnector, connector, account]);


  React.useEffect(() => {

    network_id = window.ethereum.networkVersion;
    if (network_id == 97) {
      web3 = web3_binance;
      contract_addr = binance_contr;
      setmainCurrency("BNB");
    }
    if (network_id == 3) {
      web3 = web3_ropsten;
      contract_addr = ropsten_contr;
      setmainCurrency("ETH");
    }

    async function listenNetworkChange() {
      window.ethereum.on("chainChanged", async function () {
        window.location.reload();
      });
    }
    listenNetworkChange();

  }, []);


  const handleConnectWallet = React.useCallback(() => {
    
    if (!account) {
      setActivatingConnector(injected);
      activate(injected);
    }
  }, [account, activate]);

  React.useEffect(() => {
    async function fetchowhBalance() {
      const bal = await owhBalanceOf(owhAccount);
      if (bal != -1) {
        setOwhBalance(bal);
      } else {
        setOwhBalance("");
      }
    }
    if (owhAccount) {
      fetchowhBalance();
    }
  }, [owhAccount]);

  React.useEffect(() => {
    library?.on('block', () => {
      fetchBalance();
    })
  }, [account])

  async function deposit(amount: string) {

    const transactionParameters = {
      to: contract_addr,
      from: account,
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
    };
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    setAmount(0);
    setInfo("Your tokens will be available soon!");
  }

  return (
    <div>
      <Head>
        <title className="font-bold">D-App Dmytro Steblyna</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-around my-10">
        <div className="mx-6 sm:mx-8 w-full sm:w-2/3 xl:w-7/12 max-w-screen-md bg-white shadow-xl rounded-xl p-4 sm:p-8 lg:p-10 mb-10">
          <div className="flex justify-around my-6">
            <MetaMaskLogo
              className="cursor-pointer"
              onClick={handleConnectWallet}
            />
          </div>

          {account ? (
            <>
              <div className="mb-6 border-b border-gray-300 pb-6">
                <div className="flex justify-around">
                  <p className="text-gray-600 text-xs sm:text-base lg:text-lg">
                    {account}
                  </p>
                </div>
                {ethBalance ? (
                  <>
                    <div className="border-b pb-6">
                      <h2 className="text-sm text-gray-700 font-bold mt-8">Balance:</h2>
                      <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                        {ethBalance} {mainCurrency}
                      </h3>
                    </div>
                    <h3 className="text-2xl md:text2xl lg:text-3xl font-bold mt-6 text-gray-700">
                      {tokenName}
                    </h3>
                    <h2 className="text-sm text-gray-700 font-bold mt-4">User balance:</h2>
                    <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                      {balance} {tokenSymbol}
                    </h3>
                    <h2 className="text-sm text-gray-700 font-bold mt-4">Total supply:</h2>
                    <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                      {totalSupply} {tokenSymbol}
                    </h3>
                    <h2 className="text-sm text-gray-700 font-bold mt-4">Token price:</h2>
                    <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                      {tokenPrice} {mainCurrency}
                    </h3>
                    <h2 className="text-sm text-gray-700 font-bold mt-4">Buy some tokens:</h2>

                    <div className="flex mt-4">
                      <input
                        className="border p-2 px-4 w-full border-purple-300 rounded-lg focus:outline-none bg-gray-50 focus:bg-white focus:ring focus:border-purple-600"
                        type="text"
                        value={amount || ''}
                        onChange={(e) => { setAmount(e.target.value); setInfo("") }}
                        placeholder={info ? info : "Enter amount to spend"}
                      />
                      <button onClick={() => deposit(amount)} className="w-1/4 focus:outline-none bg-purple-600 rounded-lg ml-4 p-2 focus:bg-putple-500 focus:ring focus:border-purple-600 text-white font-bold">Buy</button>
                    </div>
                    <h2 className="text-sm text-gray-700 mt-2">You'll get about: {(parseFloat(amount) / parseFloat(tokenPrice)) | 0} {tokenSymbol}</h2>


                    <h2 className="text-sm text-gray-700 font-bold mt-4">Check owh balance of the user:</h2>
                    <input
                      className="border p-2 w-full mt-4 border-purple-300 rounded-lg focus:outline-none bg-gray-50 focus:bg-white focus:ring focus:border-purple-600"
                      type="text"
                      value={owhAccount || ''}
                      onChange={(e) => { setOwhAccount(e.target.value); setOwhBalance(""); }}
                    />
                    {owhBalance ? (
                      <>
                        <h2 className="text-sm text-gray-700 font-bold mt-4">User owh balance:</h2>
                        <h3 className="text-xl md:text2xl lg:text-3xl font-bold text-transparent mt-1 bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-blue-900">
                          {owhBalance} OWH
                        </h3>
                      </>) : (<> </>)}
                  </>
                ) : (<> </>)}


              </div>


              {/* <form onSubmit={e => {
                        e.preventDefault();
                        handleContractBalanceOf();
                        
                    }}>
                        <input
                            required
                            onChange={({ target }) => setContract(target.value)}
                        />
                        <button>
                            Get contract balance
                        </button>
                    </form> */}
              {/* {ContractBalance[0] !== "" ? (
                            <>
                                <span><h2><br></br>Contract balance:</h2><span><h1>Available: {ContractBalance[0]}</h1><h1>Locked: {ContractBalance[1]}</h1></span></span>
                            </>
                        ) : (
                            <></>
                        )} */}

            </>
          ) : (
            <div className="flex justify-around"><h2>No connected accounts</h2></div>
          )}
        </div>
      </div>


    </div>
  )
}

export default Home