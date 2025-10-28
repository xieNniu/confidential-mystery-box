import React from 'react';

interface ProjectInfoProps {
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export function ProjectInfo({ isOpen, onClose, isOwner }: ProjectInfoProps) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>🎰 Confidential Mystery Box</h2>
          <p style={styles.subtitle}>Confidential Mystery Box System Based on Zama FHEVM</p>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Project Introduction */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>📖 About the Project</h3>
            <p style={styles.text}>
              This is an innovative decentralized mystery box system that utilizes Zama's 
              Fully Homomorphic Encryption (FHE) technology to achieve complete confidentiality 
              of prize amounts on-chain. Users can purchase mystery boxes, and all prize amounts 
              are stored in encrypted form before being opened, ensuring fairness and surprise.
            </p>
          </section>

          {/* Core Highlights */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>✨ Core Features</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <span style={styles.icon}>🔐</span>
                <strong>On-chain Confidentiality:</strong> Prize amounts are fully encrypted using FHEVM, completely hidden from everyone before opening
              </li>
              <li style={styles.listItem}>
                <span style={styles.icon}>⚡</span>
                <strong>Dual Contract Architecture:</strong> Automatic switching between FHE mode and plaintext mode ensures system stability
              </li>
              <li style={styles.listItem}>
                <span style={styles.icon}>🎨</span>
                <strong>Arcade-Style UI:</strong> Unique retro arcade design provides an immersive experience
              </li>
              <li style={styles.listItem}>
                <span style={styles.icon}>🔄</span>
                <strong>Smart Network Detection:</strong> Automatically detects and prompts to switch to the correct blockchain network
              </li>
              <li style={styles.listItem}>
                <span style={styles.icon}>🎁</span>
                <strong>Fair & Transparent:</strong> All transactions are on-chain, verifiable and immutable
              </li>
            </ul>
          </section>

          {/* User Guide */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 User Guide</h3>
            <div style={styles.steps}>
              <div style={styles.step}>
                <div style={styles.stepNumber}>1</div>
                <div style={styles.stepContent}>
                  <strong>Connect Wallet</strong>
                  <p>Click "Connect Wallet" in the top right and connect to Sepolia testnet using MetaMask</p>
                </div>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>2</div>
                <div style={styles.stepContent}>
                  <strong>Browse Boxes</strong>
                  <p>View all available mystery box series in the arcade store, each with different prices and quantities</p>
                </div>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>3</div>
                <div style={styles.stepContent}>
                  <strong>Insert Coin & Purchase</strong>
                  <p>Click "Insert Coin" button and pay the corresponding ETH to get a mystery box</p>
                </div>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>4</div>
                <div style={styles.stepContent}>
                  <strong>Open Box</strong>
                  <p>Go to "My Boxes" page and click "Open Box" button to reveal your prize</p>
                </div>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>5</div>
                <div style={styles.stepContent}>
                  <strong>Claim Prize</strong>
                  <p>After opening the box, click "Withdraw Prize" button to transfer ETH prize to your wallet</p>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Features */}
          {isOwner && (
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>👑 Admin Features</h3>
              <div style={styles.adminBox}>
                <p style={styles.text}>As the contract owner, you have the following privileges:</p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>
                    <span style={styles.icon}>➕</span>
                    <strong>Create Series:</strong> Set box name, price, and quantity. System automatically generates random prize pool
                  </li>
                  <li style={styles.listItem}>
                    <span style={styles.icon}>💰</span>
                    <strong>Fund Prize Pool:</strong> Deposit ETH to contract to ensure sufficient funds for user prizes
                  </li>
                  <li style={styles.listItem}>
                    <span style={styles.icon}>📊</span>
                    <strong>View Balance:</strong> Monitor contract balance in real-time to ensure adequate prize pool
                  </li>
                </ul>
                <p style={styles.warning}>
                  ⚠️ Important: Before creating boxes, ensure the contract has sufficient balance in the prize pool!
                </p>
              </div>
            </section>
          )}

          {/* Tech Stack */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>🛠️ Tech Stack</h3>
            <div style={styles.techGrid}>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>🔐</div>
                <div>Zama FHEVM</div>
              </div>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>⚙️</div>
                <div>Solidity</div>
              </div>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>⚛️</div>
                <div>React + TypeScript</div>
              </div>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>🔗</div>
                <div>Ethers.js</div>
              </div>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>🚀</div>
                <div>Vite</div>
              </div>
              <div style={styles.techItem}>
                <div style={styles.techIcon}>🧰</div>
                <div>Hardhat</div>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>🗺️ Roadmap</h3>
            <div style={styles.roadmap}>
              <div style={styles.roadmapItem}>
                <div style={styles.phase}>
                  <span style={styles.phaseLabel}>Phase 1</span>
                  <span style={styles.phaseStatus}>✅ Completed</span>
                </div>
                <ul style={styles.list}>
                  <li>Basic mystery box system development</li>
                  <li>FHE integration & encrypted prizes</li>
                  <li>Arcade-style UI design</li>
                  <li>Sepolia testnet deployment</li>
                </ul>
              </div>

              <div style={styles.roadmapItem}>
                <div style={styles.phase}>
                  <span style={styles.phaseLabel}>Phase 2</span>
                  <span style={styles.phaseStatusPending}>🔄 In Progress</span>
                </div>
                <ul style={styles.list}>
                  <li>Multiple box types (Common, Rare, Legendary)</li>
                  <li>NFT prize support</li>
                  <li>Social sharing features</li>
                  <li>Leaderboard & achievement system</li>
                </ul>
              </div>

              <div style={styles.roadmapItem}>
                <div style={styles.phase}>
                  <span style={styles.phaseLabel}>Phase 3</span>
                  <span style={styles.phaseStatusFuture}>📅 Planned</span>
                </div>
                <ul style={styles.list}>
                  <li>Mainnet deployment</li>
                  <li>Decentralized governance (DAO)</li>
                  <li>Cross-chain support</li>
                  <li>Mobile app</li>
                </ul>
              </div>

              <div style={styles.roadmapItem}>
                <div style={styles.phase}>
                  <span style={styles.phaseLabel}>Phase 4</span>
                  <span style={styles.phaseStatusFuture}>📅 Planned</span>
                </div>
                <ul style={styles.list}>
                  <li>Third-party creator platform</li>
                  <li>Mystery box marketplace (secondary trading)</li>
                  <li>AI-driven dynamic prizes</li>
                  <li>GameFi integration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>📬 Contact Us</h3>
            <div style={styles.contact}>
              <p style={styles.text}>
                Welcome to participate in the Zama Developer Program and build the future of confidential computing together!
              </p>
              <div style={styles.links}>
                <a 
                  href="https://www.zama.ai/programs/developer-program" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  🏆 Developer Program
                </a>
                <a 
                  href="https://docs.zama.ai/fhevm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  📚 FHEVM Docs
                </a>
                <a 
                  href="https://status.zama.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  📡 Status
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
    backdropFilter: 'blur(10px)',
  },
  modal: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderRadius: '20px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid #fbbf24',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '2px solid #ef4444',
    color: '#ef4444',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  header: {
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    padding: '32px 24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#1e293b',
    margin: 0,
  },
  content: {
    padding: '32px',
    overflowY: 'auto',
    maxHeight: 'calc(90vh - 120px)',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '16px',
    borderBottom: '2px solid #374151',
    paddingBottom: '8px',
  },
  text: {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: 1.8,
    marginBottom: '12px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    color: '#cbd5e1',
    fontSize: '15px',
    lineHeight: 1.8,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  step: {
    display: 'flex',
    gap: '16px',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  adminBox: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '2px solid #fbbf24',
    borderRadius: '12px',
    padding: '20px',
  },
  warning: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    padding: '12px',
    color: '#fecaca',
    fontSize: '14px',
    marginTop: '16px',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  techItem: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: '14px',
    fontWeight: '500',
  },
  techIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  roadmap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  roadmapItem: {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid #374151',
    borderRadius: '12px',
    padding: '20px',
  },
  phase: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #374151',
  },
  phaseLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  phaseStatus: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    border: '1px solid #22c55e',
  },
  phaseStatusPending: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#3b82f6',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    border: '1px solid #3b82f6',
  },
  phaseStatusFuture: {
    background: 'rgba(107, 114, 128, 0.2)',
    color: '#9ca3af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    border: '1px solid #6b7280',
  },
  contact: {
    textAlign: 'center',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  link: {
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
};
