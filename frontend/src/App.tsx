import React, { useState, useEffect } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { ContractProvider } from './contexts/ContractContext';
import { useWallet } from './contexts/WalletContext';
import { useMysteryBox } from './hooks/useMysteryBox';
import { Header } from './components/Header';
import { Store } from './components/Store';
import { MyBoxes } from './components/MyBoxes';
import { Admin } from './components/Admin';
import { ArcadeLayoutFull } from './layouts/ArcadeLayoutFull';

type Tab = 'store' | 'myboxes' | 'admin';

// Internal component to access Context
function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('store');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [checkingOwner, setCheckingOwner] = useState<boolean>(true);
  const { address, isConnected } = useWallet();
  const { getContractOwner } = useMysteryBox();

  // Check if current user is contract owner
  useEffect(() => {
    const checkOwner = async () => {
      if (!isConnected || !address) {
        setIsOwner(false);
        setCheckingOwner(false);
        return;
      }

      try {
        setCheckingOwner(true);
        const ownerAddress = await getContractOwner();
        setIsOwner(address.toLowerCase() === ownerAddress);
        console.log('👤 Permission check:', { 
          currentUser: address.toLowerCase(), 
          owner: ownerAddress, 
          isOwner: address.toLowerCase() === ownerAddress 
        });
      } catch (error) {
        console.error('Failed to check owner:', error);
        setIsOwner(false);
      } finally {
        setCheckingOwner(false);
      }
    };

    checkOwner();
  }, [address, isConnected, getContractOwner]);

  // Pass tab change function to ArcadeLayoutFull
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={styles.app}>
      {activeTab === 'store' ? (
        // Arcade layout (full screen standalone)
        <ArcadeLayoutFull onTabChange={handleTabChange} isOwner={isOwner} />
      ) : (
        // Default layout
        <>
          <Header />
          
          {/* Navigation Tabs */}
          <nav style={styles.nav}>
            <div style={styles.navContainer}>
              <button
                onClick={() => setActiveTab('store')}
                style={{
                  ...styles.navButton,
                  ...(activeTab === 'store' ? styles.navButtonActive : {}),
                }}
              >
                🏪 Mystery Box Store
              </button>
              <button
                onClick={() => setActiveTab('myboxes')}
                style={{
                  ...styles.navButton,
                  ...(activeTab === 'myboxes' ? styles.navButtonActive : {}),
                }}
              >
                📦 My Boxes
              </button>
              {/* Only show admin panel for owner */}
              {isOwner && (
                <button
                  onClick={() => setActiveTab('admin')}
                  style={{
                    ...styles.navButton,
                    ...(activeTab === 'admin' ? styles.navButtonActive : {}),
                  }}
                >
                  ⚙️ Admin Panel
                </button>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <main style={styles.main}>
            {activeTab === 'store' && <Store />}
            {activeTab === 'myboxes' && <MyBoxes />}
            {activeTab === 'admin' && <Admin />}
          </main>

          {/* Footer */}
          <footer style={styles.footer}>
            <div style={styles.footerContent}>
              <p style={styles.footerText}>
                Made with ❤️ for Zama Developer Program
              </p>
              <div style={styles.footerLinks}>
                <a
                  href="https://www.zama.ai/programs/developer-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.footerLink}
                >
                  Developer Program
                </a>
                <span style={styles.separator}>|</span>
                <a
                  href="https://docs.zama.ai/fhevm"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.footerLink}
                >
                  FHEVM Docs
                </a>
                <span style={styles.separator}>|</span>
                <a
                  href="https://status.zama.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.footerLink}
                >
                  Status
                </a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

// Main App component, provides Context
function App() {
  return (
    <WalletProvider>
      <ContractProvider>
        <AppContent />
      </ContractProvider>
    </WalletProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#111827',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    backgroundColor: '#1f2937',
    borderBottom: '2px solid #374151',
    padding: '0',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '0',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent',
  },
  navButtonActive: {
    color: '#fff',
    borderBottomColor: '#3b82f6',
    backgroundColor: '#374151',
  },
  main: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#1f2937',
    borderTop: '2px solid #374151',
    padding: '2rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerText: {
    color: '#9ca3af',
    marginBottom: '1rem',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    alignItems: 'center',
  },
  footerLink: {
    color: '#60a5fa',
    textDecoration: 'none',
  },
  separator: {
    color: '#4b5563',
  },
};

export default App;
