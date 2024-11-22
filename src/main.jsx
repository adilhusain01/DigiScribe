import { createRoot } from 'react-dom/client';
import './style.css';
import App from './App.jsx';
import { WalletProvider } from './contexts/WalletContext.jsx';


createRoot(document.getElementById('root')).render(
  <WalletProvider>

      <App />

  </WalletProvider>
);
