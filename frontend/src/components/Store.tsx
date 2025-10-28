import React, { useState, useEffect } from 'react';
import { useMysteryBox } from '../hooks/useMysteryBox';
import { useWallet } from '../contexts/WalletContext';
import { BoxSeries } from '../types';
import { UI_TEXT } from '../config/constants';

export function Store() {
  const { isConnected } = useWallet();
  const { getAllSeries, purchaseBox, loading } = useMysteryBox();
  const [series, setSeries] = useState<BoxSeries[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setLoadingSeries(true);
      const data = await getAllSeries();
      setSeries(data);
    } catch (error) {
      console.error('Failed to load series:', error);
    } finally {
      setLoadingSeries(false);
    }
  };

  const handlePurchase = async (seriesId: number, price: string) => {
    if (!isConnected) {
      alert(UI_TEXT.errorConnectWallet);
      return;
    }

    try {
      setPurchasingId(seriesId);
      await purchaseBox(seriesId, price);
      alert(UI_TEXT.purchaseSuccess);
      await loadSeries();
    } catch (error: any) {
      alert(UI_TEXT.errorTransaction + ': ' + error.message);
    } finally {
      setPurchasingId(null);
    }
  };

  if (loadingSeries) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>{UI_TEXT.loading}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{UI_TEXT.storeTitle}</h2>

      {series.length === 0 ? (
        <div style={styles.empty}>{UI_TEXT.storeEmpty}</div>
      ) : (
        <div style={styles.grid}>
          {series.map((s) => (
            <div key={s.id} style={styles.card}>
              {/* Series Header */}
              <div style={styles.cardHeader}>
                <h3 style={styles.seriesName}>{s.name}</h3>
                {!s.isActive && (
                  <span style={styles.inactiveBadge}>{UI_TEXT.inactive}</span>
                )}
              </div>

              {/* Series Info */}
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>{UI_TEXT.price}:</span>
                  <span style={styles.value}>{s.price} ETH</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>{UI_TEXT.remaining}:</span>
                  <span style={styles.value}>
                    {s.remainingBoxes} / {s.totalBoxes}
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(s.id, s.price)}
                disabled={
                  !s.isActive ||
                  s.remainingBoxes === 0 ||
                  loading ||
                  purchasingId === s.id
                }
                style={{
                  ...styles.buyButton,
                  opacity:
                    !s.isActive || s.remainingBoxes === 0 || loading ? 0.5 : 1,
                  cursor:
                    !s.isActive || s.remainingBoxes === 0 || loading
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {purchasingId === s.id
                  ? UI_TEXT.loading
                  : s.remainingBoxes === 0
                  ? UI_TEXT.soldOut
                  : UI_TEXT.buyNow}
              </button>
            </div>
          ))}
        </div>
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
    transition: 'all 0.3s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  seriesName: {
    color: '#fff',
    fontSize: '1.25rem',
    margin: 0,
  },
  inactiveBadge: {
    backgroundColor: '#ef4444',
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
  label: {
    color: '#9ca3af',
    fontSize: '0.875rem',
  },
  value: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
  },
  buyButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};


