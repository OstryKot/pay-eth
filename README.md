# Komponent do transferu środków z portfela na podany adres.

### instalacja i uruchomienie

Projekt tworzymy za pomocą Vite.

```
npm create vite@last
npm install
npm install web3
npm run dev
```

`MetaMaskTransfer.tsx` - plik komponentu react.
`MetaMaskTransfer.css` - plik stylu css dla komponentu.

Do pliku `App.tsx` dodajemy komponent

```
<MetaMaskTransfer 
  onSuccess={(txHash) => console.log('Transakcja udana:', txHash)}
  onError={(error) => console.error('Błąd:', error)}
/>
```

### interface aplikacji

#### Przed połączeniem portfela.
![interface](screenshot/screen-shot-00.png)

#### Po połączeniu portfela.
![interface](screenshot/screen-shot-01.png)

## Jak to działa

Prezentacja komponentu udostępniona w YouTube

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/vWN0ias7FZk)




