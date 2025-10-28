import React, { useState, useEffect } from 'react';
import { useMysteryBox } from '../hooks/useMysteryBox';
import { useWallet } from '../contexts/WalletContext';
import { UI_TEXT } from '../config/constants';

export function Admin() {
  const { isConnected } = useWallet();
  const { createSeries, depositPrizeFund, getContractBalance, loading, refreshSeries } = useMysteryBox();
  
  // Create Series Form
  const [seriesName, setSeriesName] = useState('');
  const [boxPrice, setBoxPrice] = useState('0.01');
  const [totalBoxes, setTotalBoxes] = useState('10');
  
  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('0.1');
  const [contractBalance, setContractBalance] = useState('0');

  useEffect(() => {
    if (isConnected) {
      loadBalance();
    }
  }, [isConnected]);

  const loadBalance = async () => {
    try {
      const balance = await getContractBalance();
      setContractBalance(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert(UI_TEXT.errorConnectWallet);
      return;
    }

    try {
      await createSeries(seriesName, boxPrice, parseInt(totalBoxes));
      
      // Refresh series data
      await refreshSeries();
      
      alert(UI_TEXT.createSeriesSuccess);
      
      // Reset form
      setSeriesName('');
      setBoxPrice('0.01');
      setTotalBoxes('10');
    } catch (error: any) {
      alert(UI_TEXT.errorTransaction + ': ' + error.message);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert(UI_TEXT.errorConnectWallet);
      return;
    }

    try {
      await depositPrizeFund(depositAmount);
      alert('Deposit successful!');
      setDepositAmount('0.1');
      await loadBalance();
    } catch (error: any) {
      alert(UI_TEXT.errorTransaction + ': ' + error.message);
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>{UI_TEXT.errorConnectWallet}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{UI_TEXT.adminTitle}</h2>

      <div style={styles.grid}>
        {/* Create Series Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{UI_TEXT.createSeries}</h3>
          
          <form onSubmit={handleCreateSeries} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>{UI_TEXT.seriesName}</label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                placeholder="e.g.: Lunar New Year Box"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{UI_TEXT.boxPrice}</label>
              <input
                type="number"
                step="0.001"
                value={boxPrice}
                onChange={(e) => setBoxPrice(e.target.value)}
                placeholder="0.01"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>{UI_TEXT.totalBoxes}</label>
              <input
                type="number"
                value={totalBoxes}
                onChange={(e) => setTotalBoxes(e.target.value)}
                placeholder="10"
                required
                min="1"
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...styles.createButton,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? UI_TEXT.creating : UI_TEXT.create}
            </button>
          </form>
        </div>

        {/* Deposit Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{UI_TEXT.fundContract}</h3>
          
          <div style={styles.balanceSection}>
            <div style={styles.balanceRow}>
              <span style={styles.balanceLabel}>{UI_TEXT.contractBalance}:</span>
              <span style={styles.balanceValue}>{contractBalance} ETH</span>
            </div>
          </div>

          <form onSubmit={handleDeposit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Deposit Amount (ETH)</label>
              <input
                type="number"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.1"
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...styles.depositButton,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? UI_TEXT.depositing : UI_TEXT.deposit}
            </button>
          </form>

          <div style={styles.hint}>
            💡 Tip: Deposit ETH to contract for paying mystery box prizes
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <h3 style={styles.instructionsTitle}>📖 Instructions</h3>
        <ol style={styles.instructionsList}>
          <li>First, deposit ETH to the contract (for prize pool)</li>
          <li>Create mystery box series, set price and quantity</li>
          <li>Users can purchase mystery boxes in the store</li>
          <li>Users automatically receive ETH prizes after opening boxes</li>
          <li>In FHE mode, prize amounts are fully encrypted</li>
        </ol>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    padding: '2rem',
    border: '2px solid #374151',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#d1d5db',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    color: '#fff',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  depositButton: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  balanceSection: {
    backgroundColor: '#374151',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
  balanceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
  balanceValue: {
    color: '#fbbf24',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  hint: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#1e3a8a',
    borderRadius: '0.5rem',
    color: '#93c5fd',
    fontSize: '0.875rem',
  },
  instructions: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    padding: '2rem',
    border: '2px solid #374151',
  },
  instructionsTitle: {
    color: '#fff',
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  instructionsList: {
    color: '#d1d5db',
    fontSize: '1rem',
    lineHeight: '1.8',
    paddingLeft: '1.5rem',
  },
};

