import React, { useState, useEffect } from 'react';
import { useMysteryBox } from '../hooks/useMysteryBox';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../contexts/ContractContext';
import { UserBox } from '../types';
import { UI_TEXT } from '../config/constants';
import { formatTimestamp } from '../utils/helpers';

export function MyBoxes() {
  const { isConnected, address } = useWallet();
  const { contractType } = useContract();
  const { getUserBoxes, openBox, withdrawPrize, loading } = useMysteryBox();
  const [boxes, setBoxes] = useState<UserBox[]>([]);
  const [loadingBoxes, setLoadingBoxes] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadBoxes();
    }
  }, [isConnected, address, contractType]);

  const loadBoxes = async () => {
    try {
      setLoadingBoxes(true);
      const data = await getUserBoxes();
      setBoxes(data);
    } catch (error) {
      console.error('Failed to load boxes:', error);
    } finally {
      setLoadingBoxes(false);
    }
  };

  const handleOpenBox = async (boxId: number) => {
    try {
      setActioningId(boxId);
      await openBox(boxId);
      
      if (contractType === 'fhe') {
        alert('Open box request sent! Waiting for Gateway decryption (about 5-15 seconds)...');
        // Poll for updates
        setTimeout(() => loadBoxes(), 5000);
        setTimeout(() => loadBoxes(), 10000);
        setTimeout(() => loadBoxes(), 15000);
      } else {
        alert(UI_TEXT.openSuccess);
        await loadBoxes();
      }
    } catch (error: any) {
      alert(UI_TEXT.errorTransaction + ': ' + error.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleWithdraw = async (boxId: number) => {
    try {
      setActioningId(boxId);
      await withdrawPrize(boxId);
      alert(UI_TEXT.withdrawSuccess);
      await loadBoxes();
    } catch (error: any) {
      alert(UI_TEXT.errorTransaction + ': ' + error.message);
    } finally {
      setActioningId(null);
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>{UI_TEXT.errorConnectWallet}</div>
      </div>
    );
  }

  if (loadingBoxes) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>{UI_TEXT.loading}</div>
      </div>
    );
  }

  const unopenedBoxes = boxes.filter((b) => !b.isOpened);
  const openedBoxes = boxes.filter((b) => b.isOpened);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{UI_TEXT.myBoxesTitle}</h2>

      {boxes.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>{UI_TEXT.noBoxes}</p>
          <p style={styles.emptyHint}>{UI_TEXT.goToStore}</p>
        </div>
      ) : (
        <>
          {/* Unopened Boxes */}
          {unopenedBoxes.length > 0 && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>{UI_TEXT.unopenedBoxes}</h3>
              <div style={styles.grid}>
                {unopenedBoxes.map((box) => (
                  <div key={box.boxId} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <span style={styles.boxId}>🎁 #{box.boxId}</span>
                      {box.isDecrypting && (
                        <span style={styles.decryptingBadge}>
                          {UI_TEXT.decrypting}
                        </span>
                      )}
                    </div>

                    <div style={styles.cardBody}>
                      <div style={styles.infoRow}>
                        <span style={styles.label}>Series ID:</span>
                        <span style={styles.value}>{box.seriesId}</span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.label}>{UI_TEXT.purchaseTime}:</span>
                        <span style={styles.value}>
                          {formatTimestamp(box.purchaseTime)}
                        </span>
                      </div>

                      {contractType === 'simple' && box.prizeAmount && (
                        <div style={styles.infoRow}>
                          <span style={styles.label}>Content:</span>
                          <span style={styles.value}>🔒 {UI_TEXT.encrypted}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenBox(box.boxId)}
                      disabled={loading || actioningId === box.boxId || box.isDecrypting}
                      style={{
                        ...styles.actionButton,
                        ...styles.openButton,
                        opacity:
                          loading || actioningId === box.boxId || box.isDecrypting
                            ? 0.5
                            : 1,
                      }}
                    >
                      {actioningId === box.boxId
                        ? UI_TEXT.opening
                        : box.isDecrypting
                        ? UI_TEXT.decrypting
                        : UI_TEXT.openBox}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Opened Boxes */}
          {openedBoxes.length > 0 && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>{UI_TEXT.openedBoxes}</h3>
              <div style={styles.grid}>
                {openedBoxes.map((box) => {
                  const prizeAmount =
                    contractType === 'fhe'
                      ? box.revealedPrizeAmount
                      : box.prizeAmount;
                  const hasWithdrawn = !prizeAmount || parseFloat(prizeAmount) === 0;

                  return (
                    <div 
                      key={box.boxId} 
                      style={{
                        ...styles.card,
                        ...(hasWithdrawn ? styles.cardDisabled : {}),
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <span style={styles.boxId}>🎁 #{box.boxId}</span>
                        <span style={hasWithdrawn ? styles.withdrawnBadge : styles.openedBadge}>
                          {hasWithdrawn ? '✓ Withdrawn' : 'Opened'}
                        </span>
                      </div>

                      <div style={styles.cardBody}>
                        <div style={styles.infoRow}>
                          <span style={styles.label}>Series ID:</span>
                          <span style={styles.value}>{box.seriesId}</span>
                        </div>

                        <div style={styles.prizeRow}>
                          <span style={styles.label}>{UI_TEXT.prizeAmount}:</span>
                          <span style={styles.prizeValue}>
                            {hasWithdrawn ? 'Withdrawn' : `${prizeAmount} ETH`}
                          </span>
                        </div>
                      </div>

                      {!hasWithdrawn && (
                        <button
                          onClick={() => handleWithdraw(box.boxId)}
                          disabled={loading || actioningId === box.boxId}
                          style={{
                            ...styles.actionButton,
                            ...styles.withdrawButton,
                            opacity:
                              loading || actioningId === box.boxId ? 0.5 : 1,
                          }}
                        >
                          {actioningId === box.boxId
                            ? UI_TEXT.withdrawing
                            : UI_TEXT.withdraw}
                        </button>
                      )}

                      {hasWithdrawn && (
                        <div style={styles.disabledNotice}>
                          ✅ Prize Successfully Withdrawn
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
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
  loading: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  emptyHint: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    color: '#d1d5db',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '2px solid #374151',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  boxId: {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  decryptingBadge: {
    backgroundColor: '#f59e0b',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
  },
  openedBadge: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#374151',
    borderRadius: '0.5rem',
  },
  label: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
  value: {
    color: '#fff',
    fontSize: '1rem',
  },
  prizeValue: {
    color: '#fbbf24',
    fontSize: '1.125rem',
    fontWeight: 'bold',
  },
  actionButton: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  openButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  withdrawButton: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  withdrawnBadge: {
    backgroundColor: '#6b7280',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
  },
  cardDisabled: {
    opacity: 0.6,
    backgroundColor: '#111827',
    border: '2px solid #1f2937',
    pointerEvents: 'none',
  },
  disabledNotice: {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#065f46',
    borderRadius: '0.5rem',
    color: '#d1fae5',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
};

