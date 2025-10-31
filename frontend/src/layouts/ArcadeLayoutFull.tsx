import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../contexts/ContractContext';
import { useMysteryBox } from '../hooks/useMysteryBox';
import { ProjectInfo } from '../components/ProjectInfo';

interface ArcadeLayoutFullProps {
  onTabChange: (tab: 'store' | 'myboxes' | 'admin') => void;
  isOwner: boolean;
}

export function ArcadeLayoutFull({ onTabChange, isOwner }: ArcadeLayoutFullProps) {
  const { address, isConnected, connectWallet, balance, isCorrectNetwork, switchNetwork } = useWallet();
  const { contractType, gatewayStatus } = useContract();
  const { series, loading, purchaseBox, refreshSeries } = useMysteryBox();
  
  const [spinning, setSpinning] = useState<number | null>(null);
  const [dropped, setDropped] = useState<number | null>(null);
  const [showProjectInfo, setShowProjectInfo] = useState<boolean>(false);

  // Debug logging
  console.log('🎰 Arcade Layout Data:', {
    series,
    seriesCount: series?.length,
    loading,
    isConnected,
    contractType,
  });

  const handleBuyBox = async (seriesId: number, price: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      await connectWallet();
      return;
    }

    setSpinning(seriesId);
    
    try {
      await purchaseBox(seriesId, price);
      
      // Refresh data and show animation
      await refreshSeries();
      
      setTimeout(() => {
        setSpinning(null);
        setDropped(seriesId);
        setTimeout(() => setDropped(null), 2000);
      }, 500);
      
      alert('🎉 Purchase successful! Check "My Boxes"');
    } catch (error) {
      console.error('Purchase failed:', error);
      setSpinning(null);
      alert('Purchase failed, please check console');
    }
  };

  // Color scheme
  const colors = ['#60a5fa', '#fbbf24', '#a78bfa', '#f87171', '#34d399', '#fb923c'];

  return (
    <div style={styles.container}>
      {/* Top Status Bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          <span style={styles.arcadeTitle}>🎰 MYSTERY BOX ARCADE</span>
          <span style={styles.statusDivider}>|</span>
          <span style={{
            ...styles.gatewayStatus,
            color: gatewayStatus === 'up' ? '#22c55e' : '#ef4444',
          }}>
            {gatewayStatus === 'up' ? '🟢 Gateway Online' : '🔴 Gateway Offline'}
          </span>
          <span style={styles.statusDivider}>|</span>
          <span style={styles.mode}>
            {contractType === 'fhe' ? '🔐 FHE Mode' : '📋 Plaintext Mode'}
          </span>
          <span style={styles.statusDivider}>|</span>
          <span style={{
            ...styles.networkStatus,
            color: isConnected && isCorrectNetwork ? '#22c55e' : '#ef4444',
          }}>
            {isConnected ? (isCorrectNetwork ? '⛓️ Sepolia' : '⚠️ Wrong Network') : '⛓️ Not Connected'}
          </span>
          <span style={styles.statusDivider}>|</span>
          <span style={{ ...styles.mode, color: isOwner ? '#22c55e' : '#ef4444' }}>
            {isOwner ? '👑 Admin' : '👤 User'}
          </span>
        </div>
        
        <div style={styles.statusRight}>
          {/* Project Info Button - Always Show */}
          <button 
            onClick={() => setShowProjectInfo(true)}
            style={styles.infoBtn}
            title="Project Info"
          >
            📖 Info
          </button>

          {isConnected && !isCorrectNetwork && (
            <button 
              onClick={switchNetwork}
              style={styles.switchNetworkBtn}
              title="Switch to Sepolia Testnet"
            >
              ⚠️ Switch to Sepolia
            </button>
          )}
          {isConnected && isCorrectNetwork && (
            <>
              <button 
                onClick={() => {
                  console.log('🔄 Manual refresh data');
                  refreshSeries();
                }}
                style={styles.refreshBtn}
                title="Refresh Data"
              >
                🔄
              </button>
              <span style={styles.balance}>💰 {balance} ETH</span>
              <span style={styles.address}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </>
          )}
          {!isConnected && (
            <button onClick={connectWallet} style={styles.connectBtn}>
              🔌 Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Neon Title */}
      <div style={styles.header}>
        <h1 style={styles.neonTitle}>
          ⚡ Insert Coin · Spin · Surprise ⚡
        </h1>
      </div>

      {/* Network Error Warning */}
      {isConnected && !isCorrectNetwork && (
        <div style={styles.networkErrorOverlay}>
          <div style={styles.networkErrorCard}>
            <div style={styles.networkErrorIcon}>⚠️</div>
            <div style={styles.networkErrorTitle}>Network Error</div>
            <div style={styles.networkErrorText}>
              You are not on Sepolia Testnet
              <br />
              Please switch network to continue
            </div>
            <button 
              onClick={switchNetwork}
              style={styles.networkErrorButton}
            >
              🔄 Switch to Sepolia Now
            </button>
          </div>
        </div>
      )}

      {/* Loading State - Only show overlay when no data and loading */}
      {loading && (!series || series.length === 0) && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}>⚙️</div>
          <div style={styles.loadingText}>Loading...</div>
        </div>
      )}

      {/* Arcade Machine Grid */}
      {series && series.length > 0 ? (
        <div style={styles.arcadeGrid}>
          {series.map((box, index) => (
            <div key={box.id} style={styles.machine}>
              {/* Machine Top Decoration */}
              <div style={{
                ...styles.machineTop,
                background: `linear-gradient(135deg, ${colors[index % colors.length]}, ${adjustBrightness(colors[index % colors.length], -30)})`,
              }}>
                <div style={styles.lightBulbs}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.bulb,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <div style={styles.machineLabel}>Series #{box.id}</div>
              </div>

              {/* Glass Display Window */}
              <div style={styles.glassWindow}>
                <div style={styles.glassReflection} />
                
                {/* Box Display */}
                <div
                  style={{
                    ...styles.boxDisplay,
                    animation: spinning === box.id
                      ? 'spin-machine 2s ease-in-out'
                      : dropped === box.id
                      ? 'drop-box 0.8s ease-out'
                      : 'float-box 3s ease-in-out infinite',
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  <div style={{
                    ...styles.boxEmoji,
                    filter: spinning === box.id ? 'blur(4px)' : 'none',
                  }}>
                    🎁
                  </div>
                </div>

                {/* Stock Badge */}
                <div style={styles.stockBadge}>
                  Left: {box.remainingBoxes}/{box.totalBoxes}
                </div>

                {/* Decoration Stars */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.decorStar,
                      left: `${20 + i * 30}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              {/* Machine Info Panel */}
              <div style={styles.infoPanel}>
                <div style={styles.boxName}>{box.name}</div>
                <div style={styles.stats}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Price</span>
                    <span style={styles.statValue}>{box.price} ETH</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Sold</span>
                    <span style={styles.statValue}>{box.totalBoxes - box.remainingBoxes}</span>
                  </div>
                </div>
              </div>

              {/* Coin Slot / Purchase Button */}
              <button
                onClick={() => handleBuyBox(box.id, box.price)}
                disabled={spinning !== null || !box.isActive || box.remainingBoxes === 0}
                style={{
                  ...styles.coinSlot,
                  background: spinning === box.id
                    ? '#ef4444'
                    : box.remainingBoxes === 0
                    ? '#6b7280'
                    : `linear-gradient(135deg, ${colors[index % colors.length]}, ${adjustBrightness(colors[index % colors.length], -20)})`,
                  cursor: box.remainingBoxes === 0 ? 'not-allowed' : 'pointer',
                  opacity: box.remainingBoxes === 0 ? 0.5 : 1,
                }}
              >
                {spinning === box.id ? (
                  <>
                    <span style={styles.spinner}>⚙️</span>
                    <span>Spinning...</span>
                  </>
                ) : dropped === box.id ? (
                  <>
                    <span>🎉</span>
                    <span>Dropped!</span>
                  </>
                ) : box.remainingBoxes === 0 ? (
                  <>
                    <span>😢</span>
                    <span>Sold Out</span>
                  </>
                ) : (
                  <>
                    <span style={styles.coin}>🪙</span>
                    <span>Insert Coin</span>
                  </>
                )}
              </button>

              {/* Output Tray */}
              <div style={styles.outputTray}>
                <div style={styles.trayLabel}>⬇️ Pick Up Here ⬇️</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎰</div>
          <div style={styles.emptyText}>No Mystery Box Series Available</div>
          <div style={styles.emptyHint}>
            {!isConnected ? (
              <>👆 Please connect your wallet first</>
            ) : loading ? (
              <>⏳ Loading...</>
            ) : isOwner ? (
              <>
                📝 You are admin, go to "Admin Panel" to create new series<br />
                <button 
                  onClick={() => onTabChange('admin')}
                  style={{ ...styles.quickBtn, marginTop: '16px' }}
                >
                  ⚙️ Go to Admin Panel
                </button>
              </>
            ) : (
              <>🎁 Stay tuned! Admin will launch new boxes soon!</>
            )}
          </div>
          <div style={{ marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            <p>Debug Info:</p>
            <p>🔗 Connected: {isConnected ? 'Yes' : 'No'}</p>
            <p>📊 Series Count: {series?.length || 0}</p>
            <p>⚙️ Mode: {contractType}</p>
            <p>
              📍 Contract: {contractType === 'fhe' 
                ? '0x9180...f937' 
                : '0x6ca2...47A1'}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Quick Actions Bar */}
      <div style={styles.quickActions}>
        <button onClick={() => setShowProjectInfo(true)} style={styles.quickBtn}>
          📖 Project Info
        </button>
        <button onClick={() => onTabChange('myboxes')} style={styles.quickBtn}>
          📦 My Boxes
        </button>
        {/* Only show admin panel for owner */}
        {isOwner && (
          <button onClick={() => onTabChange('admin')} style={styles.quickBtn}>
            ⚙️ Admin Panel
          </button>
        )}
        <button onClick={() => onTabChange('store')} style={styles.quickBtn}>
          🎰 Back to Store
        </button>
      </div>

      {/* Project Info Modal */}
      <ProjectInfo 
        isOpen={showProjectInfo} 
        onClose={() => setShowProjectInfo(false)}
        isOwner={isOwner}
      />

      {/* Animation Styles */}
      <style>
        {`
          @keyframes float-box {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.05); }
          }
          @keyframes spin-machine {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(180deg) scale(1.2); }
            50% { transform: rotate(360deg) scale(0.8); }
            75% { transform: rotate(540deg) scale(1.2); }
            100% { transform: rotate(720deg) scale(1); }
          }
          @keyframes drop-box {
            0% { transform: translateY(-100px); opacity: 0; }
            60% { transform: translateY(20px); }
            80% { transform: translateY(-10px); }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; box-shadow: 0 0 10px #ffd700; }
            50% { opacity: 0.3; box-shadow: 0 0 5px #ffd700; }
          }
          @keyframes spin-loading {
            to { transform: rotate(360deg); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}

// 颜色亮度调整函数
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    paddingBottom: '80px',
  },
  statusBar: {
    background: 'rgba(15, 23, 42, 0.95)',
    borderBottom: '2px solid #fbbf24',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  statusLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  arcadeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fbbf24',
    letterSpacing: '2px',
  },
  statusDivider: {
    color: '#475569',
  },
  gatewayStatus: {
    fontSize: '14px',
    fontWeight: '500',
  },
  mode: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  networkStatus: {
    fontSize: '14px',
    fontWeight: '600',
  },
  statusRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  switchNetworkBtn: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)',
    animation: 'pulse 2s infinite',
  },
  balance: {
    fontSize: '14px',
    color: '#fbbf24',
    fontWeight: '600',
  },
  address: {
    fontSize: '14px',
    color: '#94a3b8',
    fontFamily: 'monospace',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 12px',
    borderRadius: '6px',
  },
  connectBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },
  refreshBtn: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    border: '2px solid #22c55e',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  infoBtn: {
    background: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    border: '2px solid #fbbf24',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px 20px',
  },
  neonTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fbbf24',
    textShadow: `
      0 0 10px #fbbf24,
      0 0 20px #fbbf24,
      0 0 40px #f59e0b
    `,
    margin: 0,
    letterSpacing: '4px',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingSpinner: {
    fontSize: '48px',
    animation: 'spin-loading 1s linear infinite',
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
    marginTop: '20px',
  },
  networkErrorOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  networkErrorCard: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    border: '3px solid #ef4444',
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
    animation: 'shake 0.5s ease-in-out',
  },
  networkErrorIcon: {
    fontSize: '72px',
    marginBottom: '24px',
  },
  networkErrorTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: '16px',
  },
  networkErrorText: {
    fontSize: '18px',
    color: '#cbd5e1',
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  networkErrorButton: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)',
    transition: 'all 0.3s ease',
  },
  arcadeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  machine: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease',
  },
  machineTop: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '4px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  machineLabel: {
    position: 'absolute',
    top: '8px',
    right: '12px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  lightBulbs: {
    display: 'flex',
    gap: '15px',
  },
  bulb: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#ffd700',
    boxShadow: '0 0 10px #ffd700',
    animation: 'blink 1.5s infinite',
  },
  glassWindow: {
    height: '280px',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '3px solid rgba(255, 255, 255, 0.1)',
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  boxDisplay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    willChange: 'transform',
  },
  boxEmoji: {
    fontSize: '120px',
    textShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    transition: 'filter 0.3s',
  },
  stockBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#fbbf24',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #fbbf24',
  },
  decorStar: {
    position: 'absolute',
    fontSize: '24px',
    animation: 'float-box 2s ease-in-out infinite',
    opacity: 0.6,
  },
  infoPanel: {
    padding: '20px',
    background: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.05)',
  },
  boxName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
    textAlign: 'center',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statItem: {
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  statValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  coinSlot: {
    width: '100%',
    padding: '20px',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  coin: {
    fontSize: '24px',
    animation: 'float-box 1s ease-in-out infinite',
  },
  spinner: {
    fontSize: '24px',
    animation: 'spin-loading 1s linear infinite',
  },
  outputTray: {
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderTop: '2px solid rgba(255, 255, 255, 0.1)',
  },
  trayLabel: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '100px 20px',
    color: '#94a3b8',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  emptyHint: {
    fontSize: '16px',
    opacity: 0.7,
  },
  quickActions: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '16px',
    background: 'rgba(15, 23, 42, 0.95)',
    padding: '16px 32px',
    borderRadius: '50px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    border: '2px solid rgba(251, 191, 36, 0.3)',
  },
  quickBtn: {
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    padding: '12px 28px',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    cursor: 'pointer',
  },
};

