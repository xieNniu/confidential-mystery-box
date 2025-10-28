import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../contexts/ContractContext';
import { UI_TEXT } from '../config/constants';
import { formatAddress } from '../utils/helpers';

export function Header() {
  const { address, isConnected, isCorrectNetwork, connectWallet, switchNetwork } =
    useWallet();
  const { contractType, gatewayStatus, isAutoMode, setAutoMode, setContractType } =
    useContract();

  const getGatewayStatusText = () => {
    switch (gatewayStatus) {
      case 'up':
        return UI_TEXT.gatewayOnline;
      case 'down':
        return UI_TEXT.gatewayOffline;
      case 'checking':
        return UI_TEXT.gatewayChecking;
      default:
        return '';
    }
  };

  const getGatewayStatusColor = () => {
    switch (gatewayStatus) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      case 'checking':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo and Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>{UI_TEXT.appTitle}</h1>
          <p style={styles.subtitle}>{UI_TEXT.appSubtitle}</p>
        </div>

        {/* Status and Controls */}
        <div style={styles.controls}>
          {/* Gateway Status */}
          <div style={styles.statusCard}>
            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusDot,
                  backgroundColor: getGatewayStatusColor(),
                }}
              />
              <span style={styles.statusText}>{getGatewayStatusText()}</span>
            </div>
            
            <div style={styles.modeRow}>
              <span style={styles.modeLabel}>
                {contractType === 'fhe' ? UI_TEXT.fheMode : UI_TEXT.simpleMode}
              </span>
              
              {/* Auto/Manual Toggle */}
              <button
                onClick={() => setAutoMode(!isAutoMode)}
                style={{
                  ...styles.modeButton,
                  backgroundColor: isAutoMode ? '#3b82f6' : '#6b7280',
                }}
              >
                {isAutoMode ? UI_TEXT.autoMode : UI_TEXT.manualMode}
              </button>
            </div>

            {/* Manual Mode Selector */}
            {!isAutoMode && (
              <div style={styles.manualSelector}>
                <button
                  onClick={() => setContractType('simple')}
                  style={{
                    ...styles.selectorButton,
                    backgroundColor: contractType === 'simple' ? '#3b82f6' : '#374151',
                  }}
                >
                  Plain
                </button>
                <button
                  onClick={() => setContractType('fhe')}
                  style={{
                    ...styles.selectorButton,
                    backgroundColor: contractType === 'fhe' ? '#3b82f6' : '#374151',
                  }}
                  disabled={gatewayStatus !== 'up'}
                >
                  FHE
                </button>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          <div style={styles.walletSection}>
            {!isConnected ? (
              <button onClick={connectWallet} style={styles.connectButton}>
                {UI_TEXT.connectWallet}
              </button>
            ) : !isCorrectNetwork ? (
              <button onClick={switchNetwork} style={styles.wrongNetworkButton}>
                {UI_TEXT.switchNetwork}
              </button>
            ) : (
              <div style={styles.addressDisplay}>
                <span style={styles.addressText}>{formatAddress(address!)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: '#1f2937',
    borderBottom: '2px solid #374151',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  titleSection: {
    flex: '1 1 auto',
  },
  title: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    margin: '0.25rem 0 0 0',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  statusCard: {
    backgroundColor: '#374151',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  statusText: {
    color: '#fff',
    fontSize: '0.875rem',
  },
  modeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  modeLabel: {
    color: '#d1d5db',
    fontSize: '0.75rem',
  },
  modeButton: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    color: '#fff',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  manualSelector: {
    display: 'flex',
    gap: '0.5rem',
  },
  selectorButton: {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    border: 'none',
    color: '#fff',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  walletSection: {
    display: 'flex',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  wrongNetworkButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addressDisplay: {
    backgroundColor: '#374151',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
  },
  addressText: {
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'monospace',
  },
};


