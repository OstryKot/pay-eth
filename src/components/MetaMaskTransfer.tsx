import React, { useState } from 'react';
import Web3 from 'web3';
import './MetaMaskTransfer.css';

interface TransferFormProps {
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MetaMaskTransfer: React.FC<TransferFormProps> = ({ onSuccess, onError }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateBalance = async (web3Instance: Web3, accountAddress: string) => {
    try {
      const balanceWei = await web3Instance.eth.getBalance(accountAddress);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(Number(balanceEth).toFixed(4));
    } catch (error) {
      console.error('Błąd podczas pobierania balansu:', error);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount('');
    setBalance('');
    setStatus('idle');
    setErrorMessage('');
    
    // Usuwamy nasłuchiwanie wydarzeń
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const connectedAccount = accounts[0];
        
        setWeb3(web3Instance);
        setAccount(connectedAccount);
        await updateBalance(web3Instance, connectedAccount);

        // Nasłuchiwanie zmiany konta
        window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            // MetaMask został rozłączony z zewnątrz
            disconnectWallet();
          } else {
            setAccount(newAccounts[0]);
            await updateBalance(web3Instance, newAccounts[0]);
          }
        });

        // Nasłuchiwanie zmiany sieci
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        console.error('Błąd podczas łączenia z MetaMask:', error);
        setErrorMessage('Nie udało się połączyć z MetaMask');
      }
    } else {
      setErrorMessage('Proszę zainstalować MetaMask');
    }
  };

  const validateAddress = (addr: string): boolean => {
    return Web3.utils.isAddress(addr);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(address)) {
      setStatus('error');
      setErrorMessage('Nieprawidłowy adres ETH');
      return;
    }

    if (!web3 || !account) {
      setStatus('error');
      setErrorMessage('Web3 nie jest zainicjalizowany');
      return;
    }

    try {
      setStatus('loading');

      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      const transaction = {
        from: account,
        to: address,
        value: amountInWei,
        gas: await web3.eth.estimateGas({
          from: account,
          to: address,
          value: amountInWei
        })
      };

      const receipt = await web3.eth.sendTransaction(transaction);
      
      setStatus('success');
      if (onSuccess) {
        onSuccess(receipt.transactionHash.toString());
      }

      // Aktualizuj balans po transakcji
      await updateBalance(web3, account);

    } catch (err) {
      setStatus('error');
      const error = err as Error;
      setErrorMessage(error.message);
      if (onError) {
        onError(error);
      }
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container">
      {/* Górny pasek */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <div className="logo-icon"></div>
            <span className="logo-text">MetaMask Transfer</span>
          </div>
          
          <div className="wallet-info">
            {account ? (
              <>
                <div className="balance">
                  <div className="status-dot"></div>
                  <span>{balance} ETH</span>
                </div>
                <div className="address">
                  {shortenAddress(account)}
                </div>
                <button 
                  onClick={disconnectWallet}
                  className="button disconnect-button"
                >
                  Rozłącz portfel
                </button>
              </>
            ) : (
              <button 
                onClick={connectWallet}
                className="button connect-button"
              >
                Połącz portfel
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Główna zawartość */}
      <main className="main-content">
        <div className="transfer-card">
          <h2 className="card-title">Wyślij ETH</h2>

          <form onSubmit={handleTransfer} className="transfer-form">
            <div className="form-group">
              <label>Adres odbiorcy</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>

            <div className="form-group">
              <label>Kwota (ETH)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !web3}
              className="submit-button"
            >
              {status === 'loading' ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Przetwarzanie...</span>
                </div>
              ) : (
                'Wyślij ETH'
              )}
            </button>
          </form>

          {status === 'error' && (
            <div className="message error">
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className="message success">
              Transakcja została pomyślnie wykonana!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MetaMaskTransfer;