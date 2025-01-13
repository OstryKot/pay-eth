
import MetaMaskTransfer from './components/MetaMaskTransfer'
import './App.css'

function App() {  

  return (
    <>
      <MetaMaskTransfer 
  onSuccess={(txHash) => console.log('Transakcja udana:', txHash)}
  onError={(error) => console.error('Błąd:', error)}
/>
    </>
  )
}

export default App
