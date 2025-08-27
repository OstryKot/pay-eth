# Component for transferring funds from a wallet to a specified address.

### Installation and Setup

Create the project using Vite:

```
npm create vite@last
npm install
npm install web3
npm run dev
```

- `MetaMaskTransfer.tsx` – React component file  
- `MetaMaskTransfer.css` – CSS style file for the component  

Add the component to `App.tsx`:

```
<MetaMaskTransfer 
  onSuccess={(txHash) => console.log('Transakcja udana:', txHash)}
  onError={(error) => console.error('Błąd:', error)}
/>
```

### Application Interface

#### Before connecting the wallet
![interface](screenshot/screen-shot-00.png)

#### After connecting the wallet
![interface](screenshot/screen-shot-01.png)

## How it Works

Component demonstration available on YouTube:

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/vWN0ias7FZk)




