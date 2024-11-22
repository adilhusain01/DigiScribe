import { WalletProvider } from './contexts/WalletContext';
import { DigiScribeProvider } from './contexts/DigiScribeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <WalletProvider>
      <DigiScribeProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Dashboard />
        </div>
      </DigiScribeProvider>
    </WalletProvider>
  );
};

export default App;