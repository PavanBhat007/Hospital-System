import React, { useState, useEffect } from 'react';

const MetaMaskLogin = ({ onLogin }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      onLogin(accounts[0]);
    }
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask not detected. Please install MetaMask.');
    }
  };

  return (
    <div>
      {account ? (
        <div>Connected as: {account}</div>
      ) : (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default MetaMaskLogin;
