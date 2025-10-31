# 🎰 Confidential Mystery Box
<img width="2560" height="1279" alt="image" src="https://github.com/user-attachments/assets/97a9f8a2-dfcb-42fe-be13-cfa73a8f0c1b" />

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Zama](https://img.shields.io/badge/Powered%20by-Zama%20FHEVM-blue)](https://www.zama.ai/)
[![Sepolia Testnet](https://img.shields.io/badge/Network-Sepolia-purple)](https://sepolia.etherscan.io/)

*A decentralized mystery box system with fully encrypted prizes using Zama's Fully Homomorphic Encryption (FHE) technology*

[Demo](https://mystery-box-zama.netlify.app/) • [Video](https://youtu.be/pE8uU6Sf56k) • [Quick Start](https://mystery-box-zama.netlify.app/) • [Documentation](#documentation)

</div>

---

## 📖 Overview

Confidential Mystery Box is an innovative blockchain-based mystery box system that leverages **Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine)** to ensure complete confidentiality of prize amounts on-chain. Users can purchase, open mystery boxes, and claim ETH prizes while the actual prize values remain encrypted until revealed.

### 🌟 Why This Project?

Traditional on-chain mystery boxes face a fundamental challenge: **all data on the blockchain is publicly visible**. This means prize amounts can be seen before boxes are opened, eliminating the element of surprise and fairness.

Our solution uses **Fully Homomorphic Encryption (FHE)** to:
- ✅ Keep prize amounts **completely encrypted** on-chain
- ✅ Perform computations on encrypted data without decryption
- ✅ Ensure **provably fair** prize distribution
- ✅ Maintain **full transparency** while preserving confidentiality

---

## ✨ Features

### 🔐 Core Features
- **Fully Encrypted Prizes**: Prize amounts stored as encrypted values (euint32) on-chain
- **Dual Contract Architecture**: Automatic fallback between FHE and plaintext modes
- **Gateway Integration**: Seamless interaction with Zama's decryption gateway
- **Smart Network Detection**: Auto-detect and prompt for network switching
- **Owner-Based Access Control**: Admin panel only accessible to contract owner

### 🎨 User Interface
- **Arcade-Style Design**: Unique retro arcade machine aesthetic
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Real-Time Updates**: Live contract balance and box status
- **Wallet Integration**: MetaMask support with network validation
- **Interactive Animations**: Smooth transitions and visual feedback

### 🛡️ Security & Transparency
- **No Centralized Control**: All logic on smart contracts
- **Verifiable Randomness**: Prize generation visible in contract code
- **Immutable Records**: All transactions recorded on-chain
- **Open Source**: Fully auditable codebase

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ and npm
- MetaMask browser extension
- Sepolia testnet ETH ([get from faucet](https://sepoliafaucet.com/))
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/xieNniu/confidential-mystery-box.git
cd confidential-mystery-box
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy environment template
cp env.example .env

# Edit .env and add your private key
# NEVER commit your .env file!
```

4. **Compile contracts**
```bash
npx hardhat compile
```

5. **Deploy contracts**
```bash
# Deploy plaintext fallback contract
npx hardhat run scripts/deploy_simple.js --network sepolia

# Deploy FHE-enabled contract
npx hardhat run scripts/deploy_fhe.js --network sepolia
```

6. **Update frontend configuration**

Edit `frontend/src/config/constants.ts` with your deployed contract addresses:
```typescript
export const CONTRACT_ADDRESS_SIMPLE = "0x6ca2b8Ba1219A75C75599d8298bb3EeC95b147A1";
export const CONTRACT_ADDRESS_FHE = "0x0F5866bE68a853720Fc05617547a5bBb722A7E19";
```

7. **Start frontend**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` and connect your MetaMask wallet!

---

## 📚 Documentation

### Smart Contracts

#### MysteryBoxFHE.sol
The main FHE-enabled contract that stores prize amounts as encrypted `euint32` values.

**Key Functions:**
- `createSeries()`: Create a new mystery box series (owner only)
- `purchaseBox()`: Purchase a box from a series
- `openBox()`: Request decryption of prize amount
- `withdrawPrize()`: Claim ETH prize after opening

#### MysteryBoxSimple.sol
Fallback contract using plaintext values for when the Gateway is unavailable.

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ◄─────► │   Contracts  │ ◄─────► │   Gateway   │
│  React + TS │         │ FHE / Simple │         │ Zama Relayer│
└─────────────┘         └──────────────┘         └─────────────┘
      │                         │
      │                         │
      └────── MetaMask ─────────┘
```

### Technology Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity 0.8.24
- **FHE Library**: fhevm v0.5.8
- **Development**: Hardhat
- **Frontend**: React 18 + TypeScript + Vite
- **Web3**: Ethers.js v6
- **Styling**: Inline CSS (Arcade theme)

---

## 🎮 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Sepolia network

2. **Browse Mystery Boxes**
   - View available series in the arcade store
   - Check price and remaining boxes

3. **Purchase a Box**
   - Click "Insert Coin" button
   - Confirm transaction in MetaMask
   - Wait for confirmation

4. **Open Your Box**
   - Go to "My Boxes" tab
   - Click "Open Box"
   - Wait 5-15 seconds for Gateway decryption (FHE mode)

5. **Claim Prize**
   - After opening, click "Withdraw Prize"
   - ETH will be transferred to your wallet

### For Admins (Contract Owner)

1. **Fund Contract**
   - Go to "Admin Panel"
   - Enter deposit amount
   - Click "Deposit" and confirm transaction

2. **Create Series**
   - Enter series name, price, and quantity
   - System generates random prize pool (50-150% of box price)
   - Click "Create Series"

---

## 🔧 Configuration

### Environment Variables

See `env.example` for all configuration options:

| Variable | Description | Required |
|----------|-------------|----------|
| `PRIVATE_KEY` | Your wallet private key | ✅ |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint | ✅ |
| `FHEVM_GATEWAY_URL` | Zama Gateway URL | ✅ |
| `FHEVM_ACL_CONTRACT_ADDRESS` | ACL contract address | ✅ |

### Frontend Constants

Located in `frontend/src/config/constants.ts`:
- Contract addresses
- Network configuration
- FHEVM SDK settings
- UI text strings

---

## 🧪 Testing

```bash
# Run Hardhat tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Test on local network
npx hardhat node
npx hardhat run scripts/deploy_simple.js --network localhost
```

---

## 📊 Project Status

### ✅ Phase 1 (Completed)
- [x] Basic mystery box system
- [x] FHE integration
- [x] Arcade-style UI
- [x] Sepolia deployment

### 🔄 Phase 2 (In Progress)
- [ ] Multiple box rarities
- [ ] NFT prize support
- [ ] Social sharing
- [ ] Leaderboard system

### 📅 Phase 3 (Planned)
- [ ] Mainnet deployment
- [ ] DAO governance
- [ ] Cross-chain support
- [ ] Mobile app

### 📅 Phase 4 (Future)
- [ ] Creator platform
- [ ] Secondary marketplace
- [ ] AI-driven prizes
- [ ] GameFi integration

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama** - For the incredible FHEVM technology and developer program
- **Ethereum Foundation** - For the Sepolia testnet
- **OpenZeppelin** - For secure smart contract libraries
- **Hardhat** - For the excellent development environment

---

## 📞 Contact & Links

- **Zama Developer Program**: [https://www.zama.ai/programs/developer-program](https://www.zama.ai/programs/developer-program)
- **FHEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Zama Status**: [https://status.zama.ai/](https://status.zama.ai/)
- **Project Issues**: [GitHub Issues](https://github.com/xieNniu/confidential-mystery-box/issues)
- **GitHub Repository**: [https://github.com/xieNniu/confidential-mystery-box](https://github.com/xieNniu/confidential-mystery-box)

---

## ⚠️ Disclaimer

This project is currently deployed on Sepolia testnet for demonstration purposes. **DO NOT use with real assets on mainnet without thorough security audits.**

The FHE technology and Gateway service are still in development. Performance and availability may vary.

---

<div align="center">

**Made with ❤️ for the Zama Developer Program**

[![Star this repo](https://img.shields.io/github/stars/xieNniu/confidential-mystery-box?style=social)](https://github.com/xieNniu/confidential-mystery-box)

</div>
